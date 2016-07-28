'''
Saving a JSON to MongoDB
TODO:
1. MongoController can be improved
'''

from pymongo import MongoClient  # , ReturnDocument
from config import MongoConfig


class MongoController:

    def __init__(self, host="localhost", port=27107, dbname="test", collection_name="testCollection"):
        # print "constructor called"
        print host , port
        self.__client = MongoClient(host, port)
        # print "connection created"
        self.db = self.__client[dbname]
        self.__collection = self.db[collection_name]

    # def createDatabase(self, db_name=""):
    #         db = client[db_name]
    #         return db

        # def createCollection(self, db_name, collection_name):
        #     # db_name = db_name
        #     db = client[db_name]
        #     # collection_name = collection_name
        #     collection = db[collection_name]
        #     return collection

    def insert(self, dictionary):
        insertion_id = self.__collection.insert_one(dictionary).inserted_id
        print "Insert id in controller", insertion_id
        self.__client.close()
        return insertion_id

    def fetch(self, query, params=0):
        """
        Err:
        cannot send parameter
        """
        print "fetch function called"
        if params:
            print "with params"
            response = list(self.__collection.find(query, params))
        else:
            print "without params"
            response = list(self.__collection.find(query))

        self.__client.close()
        return response

    def fetchOne(self, query, params=0):
        if params:
            response = list(self.__collection.find_one(query, params))
        else:
            print "without params"
            response = list(self.__collection.find_one(query))

        self.__client.close()
        return response

    def insertMulti(self):
        pass

    def upsert(self, filter_query, update_query):
        print "upsert statement called"
        update_doc = self.__collection.update_one(
            filter_query, update_query, upsert=True)  # return updated document
        self.__client.close()
        return update_doc

    def update(self, filter_query, update_query):
        # return cursor
        cursor = self.__collection.update_one(filter_query, update_query)
        self.__client.close()
        return cursor

