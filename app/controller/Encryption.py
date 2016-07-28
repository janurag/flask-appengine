from Crypto.Cipher import AES
import base64


# String encryption using AES
class StringEncryption():

    def __init__(self):
        self.key = "NIAJVKW3Z7P8G4PWI2YYJ97FVQGARUNA"

    def encrypt(self, text):
        """
        Usage:
            cipher_text = StringEncryption().encrypt("1008")

        """
        block_size = 256  # can be 32, 64, 128, 256, 512
        padding = "{"
        if isinstance(text, str) or isinstance(text, unicode):
            pad = lambda s: s + (block_size - len(s) % block_size) * padding
            encoder = lambda c, s: base64.b64encode(c.encrypt(pad(s)))
            cipher = AES.new(self.key)
            return encoder(cipher, text)
        else:
            return text

    def decrypt(self, _hash):
        """
        Usage:
            plain_text = StringEncryption().decrypt(cipher_text)
        """

        block_size = 256  # can be 32, 64, 128, 256, 512
        padding = "{"
        if isinstance(_hash, unicode) or isinstance(_hash, str):
            if _hash and not _hash.isdigit():
                try:
                    pad = lambda s: s + \
                        (block_size - len(s) % block_size) * padding
                    decoder = lambda c, e: c.decrypt(
                        base64.b64decode(e)).rstrip(padding)
                    cipher = AES.new(self.key)
                    return decoder(cipher, _hash)
                except:
                    return _hash
            else:
                return _hash
        else:
            return _hash
