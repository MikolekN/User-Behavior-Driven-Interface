from typing import Optional, Type, List

from cyclic_payments import CyclicPayment
from repository import BaseRepository


class CyclicPaymentRepository(BaseRepository):
    COLLECTION: str = 'CyclicPayments'

    def __init__(self):
        super().__init__(self.COLLECTION)

    def _entity_class(self) -> Type[CyclicPayment]:
        return CyclicPayment

    def find_cyclic_payments(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> Optional[List[CyclicPayment]]:
        return super().find_many(query, sort_criteria)

    def find_by_issuer_id(self, cyclic_payment_from_id: str) -> Optional[CyclicPayment]:
        return super().find_by_field('cyclic_payment_from_id', cyclic_payment_from_id)
    
    def find_by_recipient_id(self, cyclic_payment_to_id: str) -> Optional[CyclicPayment]:
        return super().find_by_field('cyclic_payment_to_id', cyclic_payment_to_id)
