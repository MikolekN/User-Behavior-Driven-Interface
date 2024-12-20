import bson

from repository import BaseRepository
from ..database import Database
from ..transfers import Transfer

class TransferRepository(BaseRepository):
    COLLECTION: str = 'Transfers'

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
