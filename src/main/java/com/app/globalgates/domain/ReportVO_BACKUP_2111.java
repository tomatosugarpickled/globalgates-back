package com.app.globalgates.domain;

<<<<<<< HEAD
import com.app.globalgates.common.enumeration.ReportStatus;
import com.app.globalgates.common.enumeration.ReportTargetType;
import com.app.globalgates.audit.Period;
=======
>>>>>>> admin
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
<<<<<<< HEAD
@ToString(callSuper = true)
@EqualsAndHashCode(of = "id", callSuper = false)
@SuperBuilder
public class ReportVO extends Period {
    private Long id;
    private Long reporterId;
    private Long targetId;
    private ReportTargetType targetType;
    private String reason;
    private ReportStatus status;
=======
@ToString
@EqualsAndHashCode(of = "id",  callSuper = false)
@SuperBuilder
public class ReportVO {

>>>>>>> admin
}
