import bson
from database import Database
from cyclic_payments.cyclic_payment import CyclicPayment

class CyclicPaymentRepository:
    COLLECTION: str = 'CyclicPayments'

    @staticmethod
    def find_by_id(cyclic_payment_id: str) -> CyclicPayment | None:
        query = {'_id': bson.ObjectId(cyclic_payment_id)}
        cyclic_payment_dict = Database.find_one(CyclicPaymentRepository.COLLECTION, query)
        if cyclic_payment_dict:
            return CyclicPayment.from_dict(cyclic_payment_dict)
        return None

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
    
    @staticmethod
    def find_cyclic_payments(query: dict, sort_criteria: list[tuple[str, int]] = None) -> list[CyclicPayment] | None:
        cyclic_payments_cursor = Database.find(CyclicPaymentRepository.COLLECTION, query, sort_criteria)
        cyclic_payments = list(cyclic_payments_cursor)
        if cyclic_payments is None:
            return None

        cyclic_payments = [CyclicPayment.from_dict(item) for item in cyclic_payments]
        return cyclic_payments

    @staticmethod
    def insert(cyclic_payment: CyclicPayment) -> CyclicPayment:
        cyclic_payment_dict = cyclic_payment.to_dict()
        result = Database.insert_one(CyclicPaymentRepository.COLLECTION, cyclic_payment_dict)
        
        inserted_cyclic_payment = CyclicPaymentRepository.find_by_id(str(result.inserted_id))
        
        if inserted_cyclic_payment is None:
            raise ValueError("Failed to retrieve the CyclicPayment after insertion.")
        
        return inserted_cyclic_payment
    
    @staticmethod
    def delete_by_id(cyclic_payment_id: str) -> bool:
        query = {'_id': bson.ObjectId(cyclic_payment_id)}
        result = Database.delete_one(CyclicPaymentRepository.COLLECTION, query)
        
        return result.deleted_count > 0
    
    @staticmethod
    def update_by_id(cyclic_payment_id: str, query: dict[str, any], data: dict[str, any]) -> CyclicPayment | None:
        cyclic_payment = CyclicPaymentRepository.find_by_id(str(cyclic_payment_id))
        if not cyclic_payment:
            return None

        Database.update_one(CyclicPaymentRepository.COLLECTION, query, data)
        updated_cyclic_payment = CyclicPaymentRepository.find_by_id(str(cyclic_payment_id))
        
        return updated_cyclic_payment