from MongoController import MongoController
from config import MongoConfig
from TimeConversion import TimeConversion as TC
from Encryption import StringEncryption
import json


class License():

    """Generate License for any application

        Limitation:
        1. Currently doing for mercy
    """

    def generateLicense(self, data_var):
        # pass
        """
        NOTE:
            Can be created in credit card style
            generate function should be reviewed
            # make `active variable` zero for old id
        Err:
            - RSA encrpt the cliend id using
            - case when user just login and never logout
        """
        # data = {
        #     "start_date": "2010-12-28 17:43:25+00:00",
        #     "end_date": "2011-12-28 17:43:25+00:00",
        #     "app_name": "mercy",  # unique
        #     "client_id": "1008",
        #     "client_id_hash": "dsfghbjnkmouerAFAFAFA!@$@",
        #     "created_by": "anurag.jain@innovaccer.com",
        #     "creatiotn_date": "2015-11-25 17:43:25+00:00",
        #     "active": 0  # or 1
        # }

        cursor = MongoController(host=MongoConfig().host, port=MongoConfig(
        ).port, dbname=MongoConfig().dbname, collection_name=MongoConfig().collection)
        print "db:", MongoConfig().dbname, "collection:", MongoConfig().collection
        curr_utc_time = TC().currentUtcTime()

        data = {}
        for key, value in data_var.iteritems():
            data[key] = value

        data["creatiotn_date"] = str(curr_utc_time)
        data["active"] = int(data["active"])
        print repr(data)

        doc_var = cursor.upsert({"client_id": data["client_id"]}, {"$set": data})

        return doc_var

    def checkLicense(self, data):
        """

        NOTE:
            - store client id as string

        TODO:
           - Handle, when active is 1 for more than one than license for
            particular client
        """
        return_data = {"valid": False,
                       "diff": False,
                       "end_date": False}

        cursor = MongoController(host=MongoConfig().host, port=MongoConfig(
        ).port, dbname=MongoConfig().dbname, collection_name=MongoConfig().collection)
        print "db:", MongoConfig().dbname, "collection:", MongoConfig().collection

        # RSA code
        # try:
        #     # Decrypting client id
        #     with open("controller/rsa_private.ds", "r") as fpriv:
        #         privKey = fpriv.read()
        #     data = literal_eval(data)["client_id"]
        #     # data = data ["client_id"]
        #     print "decrypt started"
        #     data = RSA().decrypt(privKey, data) # Uncomment this in final version
        #     print repr(data)
        # except Exception as e:
        #     print e
        #     raise

        # AES
        print "AES"
        # data = json.loads(data)["client_id"]  # for flask
        data = data["client_id"]
        print repr(data)
        data = StringEncryption().decrypt(data)
        print "AES plain text", data

        query = {"client_id": data, "active": 1}

        print repr(query)
        result_doc = cursor.fetch(query)  # fetch to be compl
        print repr(result_doc)

        len_of_doc = len(result_doc)
        if len_of_doc and len_of_doc == 1:
            result_doc = result_doc[0]
            t1 = TC().currentUtcTime()
            t2 = TC().strToDateObj(result_doc['end_date'])
            if t1 <= t2:
                return_data["valid"] = True
                diff = TC().timeLeft(t1, t2)
                return_data["diff"] = diff
                return_data["end_date"] = result_doc["end_date"]
            else:
                # changing Active to 0
                query2 = {"$set": {"active": 0}}
                filter_query = {
                    result_doc["client_id"]: data}
                update_doc = MongoController().update(filter_query, query2)
                print repr(update_doc)

                return_data["valid"] = False
        else:
            if len_of_doc > 1:
                return {"status": "Err: more than one key active",
                        "valid": False}
            return_data["valid"] = False

        # print "Return data", return_data
        return return_data

    def licenseList(self, data):
        """
        Err:
        # - compele fetch funtion with params
        """
        cursor = MongoController(host=MongoConfig().host, port=MongoConfig(
        ).port, dbname=MongoConfig().dbname, collection_name=MongoConfig().collection)
        print "db:", MongoConfig().dbname, "collection:", MongoConfig().collection

        # Decrypting client id
        # try:
        #     with open("controller/rsa_private.ds", "r") as fpriv:
        #         privKey = fpriv.read()
        #     data = literal_eval(data)["client_id"]
        #     print "decrypt started"
        #     data = RSA().decrypt(privKey, data)
        #     print repr(data)

        # except Exception as e:
        #     print e
        #     raise

        # # ---- Hashing
        # print "\n*** Hashing"

        # data = json.loads(data)["client_id_hash"]

        # AES
        print "AES"
        # data = json.loads(data)["client_id"]
        data = data["client_id"]

        # data = json.loads
        data = StringEncryption().decrypt(data)
        print "AES plain text", data

        query = {"client_id": data}
        # -----
        # query = {"client_id": data}
        print repr(query)
        params = {
            "start_date": 1,
            "end_date": 1,
            "_id": 0,
            "active": 1

        }
        try:
            result_data = cursor.fetch(query, params)
        except Exception as e:
            logging.error(e)
        # dict_data = []
        # for item in result_data:
        #     dic_item
        print "result_data:", result_data
        return result_data

    # def sha256(self):
    #     pass

    # def rsaEncryption(self):
