from typing import Any, Optional

from cyclic_payments import CyclicPayment
from repository import BaseRepository

class CyclicPaymentRepository(BaseRepository):
    def __init__(self):
        super().__init__('CyclicPayments')

    def find_by_id(self, cyclic_payment_id: str) -> Optional[CyclicPayment]:
        return super().find_by_id(cyclic_payment_id, CyclicPayment)

    def find_by_field(self, field: str, value: Any) -> CyclicPayment | None:
        return super().find_by_field(field, value, CyclicPayment)

    def find_many(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[CyclicPayment] | None:
        return super().find_many(CyclicPayment, query, sort_criteria)

    def insert(self, cyclic_payment: CyclicPayment) -> CyclicPayment:
        return super().insert(cyclic_payment)

    def update(self, cyclic_payment_id: str, updates: dict[str, Any]) -> CyclicPayment | None:
        return super().update(cyclic_payment_id, updates, CyclicPayment)

    def delete(self, cyclic_payment_id: str) -> bool:
        return super().delete(cyclic_payment_id)

    def find_cyclic_payments(self, query: dict, sort_criteria: list[tuple[str, int]] = None) -> CyclicPayment | None:
        return super().find_many(CyclicPayment, query, sort_criteria)

    def find_by_issuer_id(self, cyclic_payment_from_id: str) -> CyclicPayment | None:
        return super().find_by_field('cyclic_payment_from_id', cyclic_payment_from_id, CyclicPayment)
    
    def find_by_recipient_id(self, cyclic_payment_to_id: str) -> CyclicPayment | None:
        return super().find_by_field('cyclic_payment_to_id', cyclic_payment_to_id, CyclicPayment)
