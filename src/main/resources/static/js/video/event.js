window.onload = () => {
    // -------------------------------------------------------
    // LiveKit 설정
    // -------------------------------------------------------
    const APPLICATION_SERVER_URL = "https://localhost:6080/";
    const LIVEKIT_URL = "wss://test-7paroumk.livekit.cloud";
    const LivekitClient = window.LivekitClient;

    let room = null;
    let sessionId = null;
    let mediaRecorder = null;
    let audioChunks = [];

    // 1. 페이지 진입 시 URL 파라미터로 자동 입장
    (async () => {
        const params = new URLSearchParams(window.location.search);
        const token   = params.get("token");
        const roomName = params.get("roomName");
        sessionId      = params.get("sessionId");

        if (!token || !roomName) {
            console.error("화상통화 정보가 없습니다. token:", token, "roomName:", roomName);
            return;
        }

        console.log("화상통화 입장 - roomName:", roomName);
        await joinVideoRoom(token, roomName);
    })();

    // 2. LiveKit Room 연결
    async function joinVideoRoom(token, roomName) {
        room = new LivekitClient.Room();

        room.on(LivekitClient.RoomEvent.TrackSubscribed, (track, _publication, participant) => {
            console.log("TrackSubscribed 수신 - kind:", track.kind, "/ 참가자:", participant.identity);
            addVideoTrack(track, participant.identity);
        });

        room.on(LivekitClient.RoomEvent.TrackUnsubscribed, (track, _publication, participant) => {
            console.log("TrackUnsubscribed - kind:", track.kind, "/ 참가자:", participant.identity);
            track.detach();
            document.getElementById(track.sid)?.remove();
            if (track.kind === "video") removeVideoContainer(participant.identity);
        });

        room.on(LivekitClient.RoomEvent.ParticipantDisconnected, () => {
            console.log("상대방이 퇴장했습니다.");
            endVideoCall();
        });

        try {
            await room.connect(LIVEKIT_URL, token);
            console.log("LiveKit 연결 성공 - 내 identity:", room.localParticipant.identity);
            console.log("현재 원격 참가자:", [...room.remoteParticipants.values()].map(p => p.identity));

            // [로컬 테스트용] 한 대의 PC에서 두 브라우저로 테스트 시
            // 카메라가 이미 사용 중일 수 있으므로 예외처리
            try {
                await room.connect(LIVEKIT_URL, token);
                console.log("LiveKit 연결 성공 - 내 identity:", room.localParticipant.identity);
                console.log("현재 원격 참가자:", [...room.remoteParticipants.values()].map(p => p.identity));

                try {
                    await room.localParticipant.enableCameraAndMicrophone();
                    console.log("카메라/마이크 활성화 성공");
                } catch (deviceError) {
                    console.warn("카메라/마이크 사용 불가:", deviceError.message);
                    try {
                        await room.localParticipant.setMicrophoneEnabled(true);
                        console.log("마이크만 활성화 성공");
                    } catch (audioError) {
                        console.warn("마이크도 사용 불가:", audioError.message);
                    }
                }

                // 트랙 유무와 관계없이 로컬 참가자 컨테이너는 항상 생성
                const localVideoPublication = room.localParticipant.videoTrackPublications.values().next().value;
                if (localVideoPublication?.track) {
                    console.log("로컬 트랙 렌더링 - identity:", room.localParticipant.identity);
                    addVideoTrack(localVideoPublication.track, room.localParticipant.identity, true);
                } else {
                    // 카메라 없어도 빈 컨테이너 생성해서 참가자 표시
                    console.log("카메라 없음 - 빈 컨테이너 생성:", room.localParticipant.identity);
                    const container = createVideoContainer(room.localParticipant.identity, true);
                    appendParticipantData(container, room.localParticipant.identity + " (You)");
                }

            } catch (error) {
                console.error("LiveKit 연결 실패:", error.message);
            }

            const localVideoPublication = room.localParticipant.videoTrackPublications.values().next().value;
            if (localVideoPublication?.track) {
                console.log("로컬 트랙 렌더링 - identity:", room.localParticipant.identity);
                addVideoTrack(localVideoPublication.track, room.localParticipant.identity, true);
            }

        } catch (error) {
            console.error("LiveKit 연결 실패:", error.message);
        }
    }

    // 3. 트랙 렌더링
    function addVideoTrack(track, participantIdentity, local = false) {
        // 이미 같은 트랙이 존재하면 스킵
        if (document.getElementById(track.sid)) return;

        const element = track.attach();
        element.id = track.sid;

        if (track.kind === "video") {
            const container = createVideoContainer(participantIdentity, local);
            container.append(element);
            appendParticipantData(container, participantIdentity + (local ? " (You)" : ""));
        } else {
            document.getElementById("layout-container").append(element);
        }
    }

    function createVideoContainer(participantIdentity, local = false) {
        // 이미 존재하면 재사용
        const existing = document.getElementById(`camera-${participantIdentity}`);
        if (existing) return existing;

        const container = document.createElement("div");
        container.id = `camera-${participantIdentity}`;
        container.className = "video-container";
        const layoutContainer = document.getElementById("layout-container");
        if (local) {
            layoutContainer?.prepend(container);
        } else {
            layoutContainer?.append(container);
        }
        return container;
    }

    function appendParticipantData(container, participantIdentity) {
        const dataElement = document.createElement("div");
        dataElement.className = "participant-data";
        dataElement.innerHTML = `<p>${participantIdentity}</p>`;
        container.prepend(dataElement);
    }

    function removeVideoContainer(participantIdentity) {
        document.getElementById(`camera-${participantIdentity}`)?.remove();
    }

    // 4. 녹음 (재생 버튼 = 시작, 정지 버튼 = 종료)
    document.querySelector(".play-btn")?.addEventListener("click", async () => {
        audioChunks = [];

        const audioTrack = room?.localParticipant?.audioTrackPublications?.values()?.next()?.value?.track;
        if (!audioTrack) {
            alert("마이크 트랙을 찾을 수 없습니다.");
            return;
        }

        const stream = new MediaStream([audioTrack.mediaStreamTrack]);
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            const link = document.createElement("a");
            link.href = audioUrl;
            link.download = `recording_${new Date().getTime()}.webm`;
            link.click();
            alert("녹음 파일이 다운로드되었습니다.");
        };

        mediaRecorder.start();
        console.log("녹음 시작");

        document.querySelector(".play-btn").disabled = true;
        document.querySelector(".stop-btn").disabled = false;
    });

    document.querySelector(".stop-btn")?.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            console.log("녹음 중지");
        }

        document.querySelector(".play-btn").disabled = false;
        document.querySelector(".stop-btn").disabled = true;
    });

    // 5. 통화 종료
    document.querySelector(".end-btn")?.addEventListener("click", () => {
        endVideoCall();
    });

    async function endVideoCall() {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }

        if (room) {
            // 카메라/마이크 트랙 명시적 중지 (다음 세션을 위해 점유 해제)
            room.localParticipant.videoTrackPublications.forEach(pub => pub.track?.stop());
            room.localParticipant.audioTrackPublications.forEach(pub => pub.track?.stop());
            await room.disconnect();
            room = null;
        }

        const layoutContainer = document.getElementById("layout-container");
        if (layoutContainer) layoutContainer.innerHTML = "";

        sessionId = null;
        window.location.href = "/chat";
    }

    // 6. space-title 편집
    const title = document.querySelector(".space-title");
    const editButton = document.querySelector(".edit-btn");

    if (title && editButton) {
        const STORAGE_KEY = "video_space_title";
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved?.trim()) title.textContent = saved.trim();

        editButton.addEventListener("click", () => {
            const next = window.prompt("스페이스 이름을 입력하세요", title.textContent.trim());
            if (next === null) return;
            const normalized = next.trim();
            if (!normalized) { window.alert("이름을 입력해 주세요."); return; }
            title.textContent = normalized;
            localStorage.setItem(STORAGE_KEY, normalized);
        });
    }

    // 7. 브라우저 종료 시 자동 퇴장
    window.addEventListener("beforeunload", () => {
        room?.disconnect();
    });
};
