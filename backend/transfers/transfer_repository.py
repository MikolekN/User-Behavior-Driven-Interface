import bson
from database import Database
from transfers.transfer import Transfer

class TransferRepository:
    COLLECTION: str = 'Transfers'

    @staticmethod
    def find_by_id(transfer_id: str) -> Transfer | None:
        query = {'_id': bson.ObjectId(transfer_id)}
        transfer_dict = Database.find_one(TransferRepository.COLLECTION, query)
        if transfer_dict:
            return Transfer.from_dict(transfer_dict)
        return None

    @staticmethod
    def find_by_transfer_from_id(transfer_from_id: str) -> Transfer | None:
        query = {'transfer_from_id': transfer_from_id}
        transfer_dict = Database.find_one(TransferRepository.COLLECTION, query)
        if transfer_dict:
            return Transfer.from_dict(transfer_dict)
        return None
    
    @staticmethod
    def find_by_transfer_to_id(transfer_to_id: str) -> Transfer | None:
        query = {'transfer_to_id': transfer_to_id}
        transfer_dict = Database.find_one(TransferRepository.COLLECTION, query)
        if transfer_dict:
            return Transfer.from_dict(transfer_dict)
        return None
    
    @staticmethod
    def find_all_user_transfers(transfer_from_id: str, transfer_to_id: str) -> Transfer | None:
        query = {
            '$or': [
                {'transfer_from_id': transfer_from_id}, 
                {'transfer_to_id': transfer_to_id}
            ]
        }
        sort_criteria = [("created", -1)]

        transfers_cursor = Database.find(TransferRepository.COLLECTION, query, sort_criteria)
        transfers = list(transfers_cursor)
        
        if transfers is None:
            return None
        
        return transfers

    @staticmethod
    def insert(transfer: Transfer) -> Transfer:
        transfer_dict = transfer.to_dict()
        result = Database.insert_one(TransferRepository.COLLECTION, transfer_dict)
        
        inserted_transfer = TransferRepository.find_by_id(str(result.inserted_id))
        
        if inserted_transfer is None:
            raise ValueError("Failed to retrieve the Transfer after insertion.")
        
        return inserted_transfer