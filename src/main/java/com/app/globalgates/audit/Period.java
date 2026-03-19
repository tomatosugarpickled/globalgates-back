package com.app.globalgates.audit;


import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@ToString
@SuperBuilder
public abstract class Period {
    private String createdDatetime;
    private String updatedDatetime;
}
