import hashlib
client_id = "1008"
# cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e
print hashlib.sha512(client_id).hexdigest()
# m = hashlib.sha512()
# m.update('salt')
# print m.hexdigest()
# m.update('sensitive data')
# print m.hexdigest()

# m.hexdigest()
# '70197a4d3a5cd29b62d4239007b1c5c3c0009d42d190308fd855fc459b107f40a03bd427cb6d87de18911f21ae9fdfc24dadb0163741559719669c7668d7d587'
n = hashlib.sha512()
# n.update('%ssensitive data' % 'salt')
# n.hexdigest()
# '70197a4d3a5cd29b62d4239007b1c5c3c0009d42d190308fd855fc459b107f40a03bd427cb6d87de18911f21ae9fdfc24dadb0163741559719669c7668d7d587'
# hashlib.sha512('salt' + 'sensitive data').hexdigest()
# '70197a4d3a5cd29b62d4239007b1c5c3c0009d42d190308fd855fc459b107f40a03bd427cb6d87de18911f21ae9fdfc24dadb0163741559719669c7668d7d587'
