import pymongo

class Database(object):
    URI = "mongodb://localhost:27017/"
    DATABASE_NAME = "User-Behavior-Driven-Interface"
    DATABASE = None

    @staticmethod
    def initialise():
        client = pymongo.MongoClient(Database.URI)
        Database.DATABASE = client[Database.DATABASE_NAME]

    @staticmethod
    def insert_many(collection, data):
        return Database.DATABASE[collection].insert_many(data)

    @staticmethod
    def insert_one(collection, data):
        return Database.DATABASE[collection].insert_one(data)
    
    @staticmethod
    def find(collection, query):
        return Database.DATABASE[collection].find(query)

    @staticmethod
    def find_one(collection, query):
        return Database.DATABASE[collection].find_one(query)
    
    @staticmethod
    def delete_many(collection, query):
        Database.DATABASE[collection].delete_many(query)
    
    @staticmethod
    def delete_one(collection, query):
        Database.DATABASE[collection].delete_one(query)

    @staticmethod
    def update_many(collection, query, data):
        Database.DATABASE[collection].update_many(query, data)
    
    @staticmethod
    def update_one(collection, query, data):
        Database.DATABASE[collection].update_one(query, data)
