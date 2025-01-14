package io.crowdfund.crowdfunding.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FundingResponse {
    private Long id;
    private double amount;
    private String backerName;
}