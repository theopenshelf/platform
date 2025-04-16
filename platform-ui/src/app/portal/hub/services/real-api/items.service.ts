import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  BorrowRecord,
  BorrowRecordsHubApiService,
  BorrowRecordStandalone,
  Item,
  ItemImage,
  ItemsHubApiService,
} from '../../../../api-client';
import { GetBorrowRecordsCountByStatusParams } from '../../../../models/GetBorrowRecordsCountByStatusParams';
import { GetItemsParams } from '../../../../models/GetItemsParams';
import { UIBorrowRecord } from '../../../../models/UIBorrowRecord';
import { UIBorrowRecordsPagination, UIBorrowRecordStandalone } from '../../../../models/UIBorrowRecordsPagination';
import { UIBorrowDetailedStatus } from '../../../../models/UIBorrowStatus';
import { UIItem, UIItemImage } from '../../../../models/UIItem';
import { UIItemsPagination } from '../../../../models/UIItemsPagination';
import { UIUser } from '../../../../models/UIUser';
import { ItemsService } from '../items.service';
@Injectable({
  providedIn: 'root',
})
export class APIItemsService implements ItemsService {
  constructor(private itemsApiService: ItemsHubApiService, private borrowRecordsApiService: BorrowRecordsHubApiService) { }

  getItems(params: GetItemsParams): Observable<UIItemsPagination> {
    const {
      borrowedByCurrentUser,
      borrowedBy,
      libraryIds,
      communityIds,
      categories,
      searchText,
      currentlyAvailable,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
      favorite,
    } = params;

    let sortByValue: 'createdAt' | 'borrowCount' | 'favorite' | undefined;
    switch (sortBy) {
      case 'createdAt':
        sortByValue = 'createdAt';
        break;
      case 'borrowCount':
        sortByValue = 'borrowCount';
        break;
      case 'favorite':
        sortByValue = 'favorite';
        break;
      default:
        sortByValue = undefined;
        break;
    }


    return this.itemsApiService
      .getItems(
        borrowedByCurrentUser,
        borrowedBy,
        libraryIds,
        communityIds,
        categories,
        searchText,
        currentlyAvailable,
        sortByValue,
        sortOrder,
        page,
        pageSize,
        startDate?.toISOString(),
        endDate?.toISOString(),
        favorite,
      )
      .pipe(
        map((response) => {
          debugger;
          return ({
            totalPages: response.totalPages,
            totalItems: response.totalItems,
            currentPage: response.currentPage,
            itemsPerPage: response.itemsPerPage,
            items: response.items.map(
              (item: Item) =>
                ({
                  ...item,
                  images: item.images.map(image => ({
                    imageUrl: image.imageUrl,
                    type: image.type,
                    order: image.order,
                  })) as UIItemImage[],
                  borrowRecords: item.borrowRecords.map(record => ({
                    ...record,
                    startDate: record.startDate ? new Date(record.startDate) : undefined,
                    endDate: record.endDate ? new Date(record.endDate) : undefined,
                    reservationDate: record.reservationDate ? new Date(record.reservationDate) : undefined,
                    effectiveReturnDate: record.effectiveReturnDate ? new Date(record.effectiveReturnDate) : undefined,
                    pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
                  })) as UIBorrowRecord[],
                  createdAt: item.createdAt
                    ? new Date(item.createdAt)
                    : undefined,
                }) as UIItem,
            ),
          })
        }
        ),
      );
  }

  statusMapping: Record<
    UIBorrowDetailedStatus,
    'reserved-impossible' | 'reserved-unconfirmed' | 'reserved-confirmed' | 'reserved-ready-to-pickup' | 'reserved-pickup-unconfirmed' | 'borrowed-active' | 'borrowed-due-today' | 'borrowed-late' | 'borrowed-return-unconfirmed' | 'returned-early' | 'returned-on-time' | 'returned-late' | undefined
  > = {
      [UIBorrowDetailedStatus.Returned_OnTime]: 'returned-on-time',
      [UIBorrowDetailedStatus.Borrowed_Active]: 'borrowed-active',
      [UIBorrowDetailedStatus.Borrowed_DueToday]: 'borrowed-due-today',
      [UIBorrowDetailedStatus.Borrowed_Late]: 'borrowed-late',
      [UIBorrowDetailedStatus.Returned_Early]: 'returned-early',
      [UIBorrowDetailedStatus.Returned_Late]: 'returned-late',
      [UIBorrowDetailedStatus.Reserved_Impossible]: undefined,
      [UIBorrowDetailedStatus.Reserved_Unconfirmed]: 'reserved-unconfirmed',
      [UIBorrowDetailedStatus.Reserved_Confirmed]: 'reserved-confirmed',
      [UIBorrowDetailedStatus.Reserved_ReadyToPickup]: 'reserved-ready-to-pickup',
      [UIBorrowDetailedStatus.Reserved_Pickup_Unconfirmed]: 'reserved-pickup-unconfirmed',
      [UIBorrowDetailedStatus.Borrowed_Return_Unconfirmed]: 'borrowed-return-unconfirmed',
    };

  getBorrowRecords(params: GetItemsParams): Observable<UIBorrowRecordsPagination> {
    const {
      borrowedByCurrentUser,
      borrowedBy,
      statuses,
      libraryIds,
      categories,
      searchText,
      itemId,
      currentlyAvailable,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 10,
      startDate,
      endDate,
      favorite,
    } = params;

    let statusesValue: ('reserved-confirmed' | 'reserved-ready-to-pickup' | 'borrowed-active' | 'borrowed-due-today' | 'borrowed-late' | 'returned-early' | 'returned-on-time' | 'returned-late')[] = [];
    statusesValue = statuses ? statuses.map(status => this.statusMapping[status as UIBorrowDetailedStatus] as 'reserved-confirmed' | 'reserved-ready-to-pickup' | 'borrowed-active' | 'borrowed-due-today' | 'borrowed-late' | 'returned-early' | 'returned-on-time' | 'returned-late') : [];

    let sortByValue: 'pickupDate' | 'reservationDate' | 'startDate' | 'endDate' | 'returnDate' | 'effectiveReturnDate' | undefined;
    switch (sortBy) {
      case 'pickupDate':
        sortByValue = 'pickupDate';
        break;
      case 'reservationDate':
        sortByValue = 'reservationDate';
        break;
      case 'startDate':
        sortByValue = 'startDate';
        break;
      case 'endDate':
        sortByValue = 'endDate';
        break;
      case 'returnDate':
        sortByValue = 'returnDate';
        break;
      case 'effectiveReturnDate':
        sortByValue = 'effectiveReturnDate';
        break;
      default:
        sortByValue = undefined;
        break;
    }

    return this.borrowRecordsApiService
      .getBorrowRecords(
        borrowedByCurrentUser,
        borrowedBy,
        itemId,
        sortByValue,
        sortOrder,
        libraryIds,
        categories,
        searchText,
        page,
        pageSize,
        statusesValue,
        favorite,
      )
      .pipe(
        map((response) => ({
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          currentPage: response.currentPage,
          itemsPerPage: response.recordsPerPage,
          items: response.records.map(
            (record: BorrowRecordStandalone) =>
              ({
                ...record,
                startDate: record.startDate
                  ? new Date(record.startDate)
                  : undefined,
                endDate: record.endDate ? new Date(record.endDate) : undefined,
                reservationDate: record.reservationDate
                  ? new Date(record.reservationDate)
                  : undefined,
                effectiveReturnDate: record.effectiveReturnDate
                  ? new Date(record.effectiveReturnDate)
                  : undefined,
                pickupDate: record.pickupDate
                  ? new Date(record.pickupDate)
                  : undefined,
                item: ({
                  id: record.item.id,
                  status: record.item.status,
                  name: record.item.name,
                  owner: record.item.owner,
                  description: record.item.description,
                  shortDescription: record.item.shortDescription,
                  category: record.item.category,
                  images: record.item.images.map(image => ({
                    imageUrl: image.imageUrl,
                    type: image.type,
                    order: image.order,
                  })) as UIItemImage[],
                  libraryId: record.item.libraryId,
                  favorite: record.item.favorite,
                  borrowCount: record.item.borrowCount,
                  createdAt: record.item.createdAt
                    ? new Date(record.item.createdAt)
                    : undefined,
                }) as UIItem,
                status: record.status ?? 'draft' as string,
              }) as UIBorrowRecordStandalone,
          ),
        })),
      );
  }


  getItem(id: string): Observable<UIItem> {
    return this.itemsApiService.getItem(id).pipe(
      map(
        (item: Item) =>
          ({
            ...item,
            borrowCount: item.borrowCount,
            borrowRecords: item.borrowRecords.map(record => ({
              ...record,
              startDate: record.startDate ? new Date(record.startDate) : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              reservationDate: record.reservationDate ? new Date(record.reservationDate) : undefined,
              effectiveReturnDate: record.effectiveReturnDate ? new Date(record.effectiveReturnDate) : undefined,
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            })) as UIBorrowRecord[],
            createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
            images: item.images.map(image => ({
              imageUrl: image.imageUrl,
              type: image.type,
              order: image.order,
            })) as UIItemImage[],
          }) as UIItem,
      ),
    );
  }

  addItem(item: UIItem): Observable<UIItem> {
    const apiItem = {
      ...item,
      borrowRecords: [],
      createdAt: item.createdAt?.toISOString(),
      images: item.images.map(image => ({
        imageUrl: image.imageUrl,
        type: image.type,
        order: image.order,
      })) as ItemImage[],
    } as Item;

    return this.itemsApiService.addItem(apiItem).pipe(
      map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft', // Ensure status is always a string
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              reservationDate: record.reservationDate
                ? new Date(record.reservationDate)
                : undefined,
              borrowedBy: record.borrowedBy,
            }) as UIBorrowRecord,
        ),
      })),
    );
  }

  borrowItem(
    item: UIItem,
    startDate: string,
    endDate: string,
    borrowBy: UIUser,
  ): Observable<UIItem> {
    return this.itemsApiService
      .borrowItem(item.id, { borrowBy: borrowBy.id, startDate, endDate })
      .pipe(
        map((item: Item) => ({
          ...item,
          images: item.images.map(image => ({
            imageUrl: image.imageUrl ?? '',
            type: image.type,
            order: image.order,
          })),
          status: item.status ?? 'draft',
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          borrowRecords: item.borrowRecords.map(
            (record: BorrowRecord) =>
              ({
                id: record.id,
                startDate: record.startDate
                  ? new Date(record.startDate)
                  : undefined,
                endDate: record.endDate ? new Date(record.endDate) : undefined,
                borrowedBy: record.borrowedBy,
                reservationDate: new Date()
              }) as UIBorrowRecord,
          ),
        })),
      );
  }

  cancelReservation(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService
      .deleteBorrowRecord(item.id, borrowRecord.id)
      .pipe(
        map((item: Item) => ({
          ...item,
          images: item.images.map(image => ({
            imageUrl: image.imageUrl,
            type: image.type,
            order: image.order,
          })) as UIItemImage[],
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          borrowRecords: item.borrowRecords.map(
            (record: BorrowRecord) =>
              ({
                id: record.id,
                startDate: record.startDate
                  ? new Date(record.startDate)
                  : undefined,
                endDate: record.endDate ? new Date(record.endDate) : undefined,
                borrowedBy: record.borrowedBy,
                reservationDate: new Date()
              }) as UIBorrowRecord,
          ),
        })));
  }

  returnItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService
      .returnItem(item.id, { borrowRecordId: borrowRecord.id })
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
              reservationDate: new Date()
            }) as UIBorrowRecord,
        ),
      })));
  }


  pickupItem(
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService
      .pickupItem(item.id, { borrowRecordId: borrowRecord.id })
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft',
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
              reservationDate: new Date(record.reservationDate),
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            }) as UIBorrowRecord,
        ),
      })));
  }

  getBorrowRecordsCountByStatus(params: GetBorrowRecordsCountByStatusParams): Observable<Map<UIBorrowDetailedStatus, number>> {
    const {
      borrowedByCurrentUser,
      borrowedBy,
      itemId,
      libraryIds,
      statuses,
    } = params;

    let statusesValue: ('reserved-confirmed' | 'reserved-ready-to-pickup' | 'borrowed-active' | 'borrowed-due-today' | 'borrowed-late' | 'returned-early' | 'returned-on-time' | 'returned-late')[] = [];
    statusesValue = statuses ? statuses.map(status => this.statusMapping[status as UIBorrowDetailedStatus] as 'reserved-confirmed' | 'reserved-ready-to-pickup' | 'borrowed-active' | 'borrowed-due-today' | 'borrowed-late' | 'returned-early' | 'returned-on-time' | 'returned-late') : [];

    return this.borrowRecordsApiService.getBorrowRecordsCountByStatus(
      borrowedByCurrentUser,
      borrowedBy,
      itemId,
      libraryIds,
      statusesValue,
    ).pipe(
      map((response) => new Map(Object.entries(response).map(([status, count]) => [status as UIBorrowDetailedStatus, count as number]))),
    );
  }

  markAsFavorite(item: UIItem): Observable<UIItem> {
    return this.itemsApiService
      .markAsFavorite(item.id)
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft',
        favorite: item.favorite,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              ...record,
              startDate: record.startDate ? new Date(record.startDate) : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              reservationDate: record.reservationDate ? new Date(record.reservationDate) : undefined,
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            }) as UIBorrowRecord,
        ),
      }) as UIItem));
  }

  approvalReservation(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService
      .approvalReservation(item.id, { borrowRecordId: borrowRecord.id, decision })
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft',
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
              reservationDate: new Date(record.reservationDate),
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            }) as UIBorrowRecord,
        ),
      })));
  }

  approvalPickup(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService.approvalPickup(item.id, { borrowRecordId: borrowRecord.id, decision })
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft',
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              id: record.id,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
              reservationDate: new Date(record.reservationDate),
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            }) as UIBorrowRecord,
        ),
      })));
  }

  approvalReturn(
    decision: 'approve' | 'reject',
    item: UIItem,
    borrowRecord: UIBorrowRecord,
  ): Observable<UIItem> {
    return this.itemsApiService.approvalReturn(item.id, { borrowRecordId: borrowRecord.id, decision })
      .pipe(map((item: Item) => ({
        ...item,
        images: item.images.map(image => ({
          imageUrl: image.imageUrl,
          type: image.type,
          order: image.order,
        })) as UIItemImage[],
        status: item.status ?? 'draft',
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        borrowRecords: item.borrowRecords.map(
          (record: BorrowRecord) =>
            ({
              ...record,
              startDate: record.startDate
                ? new Date(record.startDate)
                : undefined,
              endDate: record.endDate ? new Date(record.endDate) : undefined,
              borrowedBy: record.borrowedBy,
              reservationDate: new Date(record.reservationDate),
              pickupDate: record.pickupDate ? new Date(record.pickupDate) : undefined,
            }) as UIBorrowRecord,
        ),
      })));
  }
}
