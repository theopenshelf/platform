package dev.theopenshelf.platform.entities;

import java.time.LocalDate;
import java.util.UUID;

import dev.theopenshelf.platform.model.BorrowRecord;
import dev.theopenshelf.platform.model.BorrowStatus;
import jakarta.persistence.Column;
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

    @Column(name = "borrowed_by")
    private String borrowedBy;

    @Column(name = "pickup_date")
    private LocalDate pickupDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "reservation_date")
        private LocalDate reservationDate;

    @Column(name = "effective_return_date")
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