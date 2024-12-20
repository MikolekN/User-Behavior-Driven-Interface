from repository import BaseRepository
from ..database import Database
from ..cyclic_payments import CyclicPayment

import bson

class CyclicPaymentRepository(BaseRepository):
    COLLECTION: str = 'CyclicPayments'

    @staticmethod
    def find_by_issuer_id(cyclic_payment_from_id: str) -> CyclicPayment | None:
        query = {'issuer_id': cyclic_payment_from_id}
        cyclic_payment_dict = Database.find_one(CyclicPaymentRepository.COLLECTION, query)
        if cyclic_payment_dict:
            return CyclicPayment.from_dict(cyclic_payment_dict)
        return None
    
    @staticmethod
    def find_by_recipient_id(cyclic_payment_to_id: str) -> CyclicPayment | None:
        query = {'recipient_id': cyclic_payment_to_id}
        cyclic_payment_dict = Database.find_one(CyclicPaymentRepository.COLLECTION, query)
        if cyclic_payment_dict:
            return CyclicPayment.from_dict(cyclic_payment_dict)
        return None
