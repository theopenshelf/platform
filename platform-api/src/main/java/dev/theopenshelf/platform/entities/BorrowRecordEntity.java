package dev.theopenshelf.platform.entities;

import java.time.LocalDate;
import java.util.UUID;

import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.BorrowStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "borrow_records")
public class BorrowRecordEntity {
    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private ItemEntity item;

    private String borrowedBy;
    private LocalDate pickupDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate reservationDate;
    private LocalDate effectiveReturnDate;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;

    public BorrowRecord.BorrowRecordBuilder toBorrowRecord() {
        return BorrowRecord.builder()
                .id(id)
                .borrowedBy(borrowedBy)
                .pickupDate(pickupDate)
                .startDate(startDate)
                .endDate(endDate)
                .reservationDate(reservationDate)
                .effectiveReturnDate(effectiveReturnDate)
                .status(status);
    }
}