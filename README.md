# Global Gates — 백엔드

중소기업이 해외 바이어를 찾고 소통하는 무역 B2B SNS 팀 프로젝트입니다.
이 저장소는 [gb-globalgates/back](https://github.com/gb-globalgates/back)의 fork이며, 아래에는 **홍성호가 담당한 회원 도메인과 연동 구간**을 정리했습니다.

[전체 포트폴리오](https://app.notion.com/399c7b94f5a6812aa6dcec7f535538be) · [GitHub 프로필](https://github.com/tomatosugarpickled) · [기술 블로그](https://velog.io/@tjdgh1851/posts)

## 프로젝트와 담당 범위

- **기간:** 2026.03.20 ~ 2026.05.22
- **형태:** 팀 프로젝트
- **회원·인증:** 회원가입·로그인, JWT 발급·재발급, OAuth2 간편 로그인, Redis 기반 토큰 처리
- **마이페이지·설정:** 프로필과 활동 목록, 계정 정보 변경, 알림 설정, 계정 비활성화·재활성화
- **AI 연동:** Spring WebClient로 FastAPI 호출, 요청·응답 DTO와 S3 객체 키 규약 연결
- **자동화·배포:** n8n 뉴스 수집·요약·적재, GitHub Actions와 Docker를 이용한 EC2 배포

AI 영역의 담당 범위는 Spring 서버의 연동 구간입니다. 모델 개발과 팀원이 구현한 전체 서비스 기능은 개인 기여에 포함하지 않았습니다.

## 저장소 안내

| 저장소 | 역할 |
| --- | --- |
| [globalgates-back](https://github.com/tomatosugarpickled/globalgates-back) | 개발 과정의 백엔드 코드와 변경 이력 |
| [CI-CD-globalgates](https://github.com/CI-CD-globalgates/CI-CD-globalgates) | 배포 구성과 배포용 애플리케이션 코드 |
| [globalgates-front](https://github.com/tomatosugarpickled/globalgates-front) | 프론트엔드 작업 기록 |

**개발 저장소와 배포 저장소는 반영 시점이 다릅니다.** 특히 아래 캐시 수정은 배포 저장소 코드로 연결했습니다. 이 개발 저장소의 회원 정보 변경 메서드에는 `@CachePut` 사용이 남아 있습니다.

## 대표 문제 해결

### 1. 계정 비활성화 직후 로그아웃 실패

**문제:** 비활성화된 계정으로 로그아웃을 요청하면, 인증 필터의 활성 회원 조회에서 실패해 컨트롤러까지 도달하지 못할 수 있었습니다.

**변경:** `/api/auth/logout` 경로에서는 `UsernameNotFoundException` 발생 시 인증 객체 복원을 건너뛰도록 처리했습니다. 컨트롤러에서는 토큰이 null 또는 빈 문자열인지 확인한 뒤 Refresh Token 삭제와 블랙리스트 등록을 수행하도록 보완했습니다.

**설계 범위:** 예외 처리를 로그아웃 경로로 제한했습니다. 다른 경로의 회원 조회 실패는 그대로 전파합니다.

- [수정 커밋 920b04c](https://github.com/tomatosugarpickled/globalgates-back/commit/920b04cd40f7fec4516b9c0f22c49367f42a1b32)
- [AuthenticationFilter](src/main/java/com/app/globalgates/auth/AuthenticationFilter.java)
- [AuthController](src/main/java/com/app/globalgates/controller/AuthController.java)

### 2. CustomUserDetails의 로그인 식별값 누락

**문제:** 인증 객체의 `loginId`가 null이 되어 비밀번호·핸들·이메일 변경 과정에서 회원 조회가 실패했습니다.

**원인과 변경:** 조회 DTO에 없는 식별값을 다시 꺼내던 방식을 바꾸고, `loadUserByUsername(loginId)`가 받은 값을 `CustomUserDetails` 생성자에 직접 전달했습니다.

- [수정 커밋 cf41f5e](https://github.com/tomatosugarpickled/globalgates-back/commit/cf41f5eeaf2f1eac41680d88d59a41d5abc778d7)
- [CustomUserDetails](src/main/java/com/app/globalgates/auth/CustomUserDetails.java)
- [CustomUserDetailService](src/main/java/com/app/globalgates/service/CustomUserDetailService.java)
- [설정 화면 컨트롤러 테스트](src/test/java/com/app/globalgates/controller/setting/SettingControllerTest.java)

위 테스트는 인증 객체의 식별값으로 회원을 조회하고, 반환한 회원을 화면 모델에 전달하는 동작을 다룹니다.

### 3. 반환값이 없는 회원 변경 메서드의 캐시 처리

**문제:** `@CachePut`은 메서드 반환값을 캐시에 저장합니다. `void` 변경 메서드에 적용하면 최신 회원 객체로 캐시를 갱신하려는 의도와 맞지 않습니다.

**변경:** 배포 저장소에서는 회원 정보 변경 시 해당 키를 `@CacheEvict`로 제거하고, 이후 조회가 DB에서 값을 읽어 캐시를 채우도록 구성했습니다.

- [개발 저장소의 MemberService](src/main/java/com/app/globalgates/service/MemberService.java)
- [배포 저장소에 반영된 MemberService](https://github.com/CI-CD-globalgates/CI-CD-globalgates/blob/master/src/main/java/com/app/globalgates/service/MemberService.java)
- [기존 @CachePut 도입 이력 920b04c](https://github.com/tomatosugarpickled/globalgates-back/commit/920b04cd40f7fec4516b9c0f22c49367f42a1b32)

### 4. 비밀번호 확인 요청의 URL 노출 경로 제거

비밀번호 확인 요청을 GET 쿼리 파라미터에서 POST 요청 본문으로 변경했습니다. URL에 비밀번호 확인값을 포함하지 않도록 한 변경이며, 요청 본문과 인증 정보의 로깅 정책은 별도 점검 대상입니다.

- [수정 커밋 57390bb](https://github.com/tomatosugarpickled/globalgates-back/commit/57390bb8c35f97e2dd42c196815567d7829900fa)

## 기술과 구조

| 영역 | 사용 기술 |
| --- | --- |
| 애플리케이션 | Java 17, Spring Boot 3.5.11, Spring MVC, Thymeleaf |
| 인증 | Spring Security, OAuth2 Client, JWT |
| 데이터 | MyBatis, PostgreSQL, Redis |
| 파일·외부 연동 | AWS S3, FastAPI 연동 |
| 배포·자동화 | Docker, GitHub Actions, EC2, n8n |

`build.gradle` 기준 버전과 의존성은 [빌드 설정](build.gradle)에서 확인할 수 있습니다.

회원 기능은 Controller → Service → DAO → Mapper → DB 순서로 처리합니다.
인증 필터는 요청 앞단에서 인증 정보를 구성하고, AI 기능이 필요한 구간에서는 Spring 서버가 FastAPI를 호출합니다.

주요 코드 위치:

- [인증](src/main/java/com/app/globalgates/auth)
- [컨트롤러](src/main/java/com/app/globalgates/controller)
- [서비스](src/main/java/com/app/globalgates/service)
- [DAO](src/main/java/com/app/globalgates/repository)
- [MyBatis Mapper](src/main/resources/mapper)
- [테스트](src/test/java/com/app/globalgates)

## 실행 준비

이 저장소는 외부 서비스 설정과 DB 준비가 필요한 팀 프로젝트입니다. 저장소만 내려받아 바로 실행되는 독립 데모 환경은 아닙니다.

1. JDK 17을 준비합니다. Gradle은 저장소의 Wrapper를 사용합니다.
2. PostgreSQL 스키마와 초기 데이터, Redis 접속 환경을 준비합니다.
3. DB·Redis, JWT, OAuth2, AWS S3 및 사용하는 외부 연동의 설정을 실행 환경에 제공합니다. 실제 설정 파일은 별도로 준비해야 합니다.
4. 저장소 루트에서 아래 명령을 실행합니다.

`.gitignore`에서 YAML 및 환경변수 파일을 제외하고 있습니다. 이 문서는 비밀값이나 실제 접속 정보를 포함하지 않습니다.

**macOS / Linux**

```sh
./gradlew bootRun
```

**Windows PowerShell**

```powershell
.\gradlew.bat bootRun
```

## 검증 범위와 남은 과제

이 README는 코드와 커밋을 바탕으로 담당 범위를 정리했습니다. 이 문서를 작성하면서 애플리케이션 실행이나 테스트를 수행하지 않았습니다.

- [SettingControllerTest](src/test/java/com/app/globalgates/controller/setting/SettingControllerTest.java)는 설정 화면에 인증된 회원을 전달하는 테스트 코드입니다.
- [MemberServicePasswordTest](src/test/java/com/app/globalgates/service/MemberServicePasswordTest.java)는 현재 개발 저장소에서 주석 처리되어 있습니다. 실행되는 테스트 수나 통과 근거에 포함하지 않습니다.
- 캐시 갱신 후 재조회·회원별 격리·식별값 변경·동시 요청의 실행 검증이 남아 있습니다.
- 계정 비활성화 후 로그아웃, 정상·누락·만료 토큰 및 Refresh Token만 남은 경로, 외부 서비스 실패에 대한 회귀 검증이 필요합니다.
- 개발 저장소와 배포 저장소의 변경 반영 차이를 정리할 필요가 있습니다.

테스트 환경을 준비한 뒤 실행할 명령:

```sh
./gradlew test
```

Windows에서는 `.\gradlew.bat test`를 사용합니다. 테스트 태스크의 성공 여부와 실제 실행된 테스트 수를 함께 확인해야 합니다.

## 상세 자료

[노션 포트폴리오](https://app.notion.com/399c7b94f5a6812aa6dcec7f535538be)에 담당 기능, 변경 전후 코드 이미지, ERD, 화면 자료와 요청 흐름도를 모았습니다.
