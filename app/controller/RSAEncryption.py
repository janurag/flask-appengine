import Crypto
from Crypto.PublicKey import RSA
from Crypto import Random
import ast


def file_write(path_to_file, mode, data):
    '''
    Description:
    converting file write to one-line

    @params      p   (type)
    @params      pwd     (type)
    return
    Use case:
    file_write('./file_dir/text.txt', "w+", data_to_write)

    '''
    f = open(path_to_file, mode)
    f.write(data)
    f.close()
    return "file write success"


class RSAEncryption():

    def generateKeys(self, random=0):
        """
        :param: random should be `1` if you need to randomly generate keys

        Usage:
            keys = RSAEncryption().generateKeys()
        """
        random_generator = Random.new().read
        print type(random_generator)
        print random_generator
        if random:
            # generate pub and priv key
            key = RSA.generate(2048, random_generator)
        else:
            key = RSA.generate(2048)  # generate pub and priv key

        binPrivKey = key.exportKey('DER')
        binPubKey = key.publickey().exportKey('DER')
        return {"private_key": binPrivKey,
                "public_key": binPubKey}

    def encrypt(self, public_key, msg):
        """
        Usage:
            emsg = RSAEncryption().encrypt(public_key, msg)
            print emsg

        """

        pubKeyObj = RSA.importKey(public_key)
        emsg = pubKeyObj.encrypt(msg, 'x')[0]
        return emsg


    def decrypt(self, private_key, encrpyted_msg):
        """
        Usage:
            dmsg = RSAEncryption().decrypt(private_key, msg)
            print dmsg
        """
        privKeyObj = RSA.importKey(private_key)
        dmsg = privKeyObj.decrypt(encrpyted_msg)
        print "decryption done"
        return dmsg


