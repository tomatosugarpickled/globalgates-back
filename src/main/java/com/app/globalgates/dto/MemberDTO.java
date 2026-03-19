package com.app.globalgates.dto;

import com.app.globalgates.common.enumeration.MemberRole;
import com.app.globalgates.common.enumeration.OAuthProvider;
import com.app.globalgates.common.enumeration.Status;
import com.app.globalgates.domain.MemberVO;
import com.app.globalgates.domain.OAuthVO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@Getter @Setter @ToString
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
public class MemberDTO implements Serializable {
//    버전 올려야 할 때
//    필드 자료형 변경
//    핵심 비즈니스(인증체제, 다중권한 변경 등) 로직 변경
    @Serial
    private static final long serialVersionUID = 1L;

    private Long id;
    private String memberName;
    private String memberEmail;
//    화면에서 받는 건 가능
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String memberPassword;
    private boolean memberEmailVerified;
    private Status memberStatus;
    private MemberRole memberRole;
    private String providerId;
    private OAuthProvider provider;
    private String profileURL;
    private Long memberId;
    private String createdDatetime;
    private String updatedDatetime;
    private boolean isRemember;

    public MemberVO toMemberVO(){
        return MemberVO.builder()
                .id(id)
                .memberName(memberName)
                .memberEmail(memberEmail)
                .memberPassword(memberPassword)
                .memberEmailVerified(memberEmailVerified)
                .memberStatus(memberStatus)
                .memberRole(memberRole)
                .build();
    }

    public OAuthVO toOAuthVO(){
        return OAuthVO.builder()
                .providerId(providerId)
                .provider(provider)
                .profileURL(profileURL)
                .memberId(memberId)
                .build();
    }
}
