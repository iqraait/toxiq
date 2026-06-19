# import hashlib
# from django.conf import settings

# class PayUService:
#     @staticmethod
#     def generate_hash(txnid, amount, productinfo, firstname, email, udf1='', udf2='', udf3='', udf4='', udf5=''):
#         """
#         Generates payment hash to be sent to PayU.
#         Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
#         """
#         key = settings.PAYU_MERCHANT_KEY
#         salt = settings.PAYU_SALT

#         # Ensure values are strings and clean
#         txnid = str(txnid)
#         amount = f"{float(amount):.2f}"
#         productinfo = str(productinfo)
#         firstname = str(firstname)
#         email = str(email)

#         hash_sequence = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
        
#         hasher = hashlib.sha512()
#         hasher.update(hash_sequence.encode('utf-8'))
#         return hasher.hexdigest().lower()

#     @staticmethod
#     def verify_response_hash(response_data):
#         """
#         Verifies the response hash returned from PayU.
#         Formula: sha512(SALT|status|additionalCharges|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
#         """
#         salt = settings.PAYU_SALT
        
#         # Extracted parameters
#         key = response_data.get('key', '')
#         txnid = response_data.get('txnid', '')
#         amount = response_data.get('amount', '')
#         productinfo = response_data.get('productinfo', '')
#         firstname = response_data.get('firstname', '')
#         email = response_data.get('email', '')
#         status = response_data.get('status', '')
#         additional_charges = response_data.get('additionalCharges', '')
        
#         udf1 = response_data.get('udf1', '')
#         udf2 = response_data.get('udf2', '')
#         udf3 = response_data.get('udf3', '')
#         udf4 = response_data.get('udf4', '')
#         udf5 = response_data.get('udf5', '')
        
#         received_hash = response_data.get('hash', '')

#         # Standardize amount format to 2 decimal places if needed
#         try:
#             amount = f"{float(amount):.2f}"
#         except ValueError:
#             pass

#         # Create hashing pattern
#         if additional_charges:
#             hash_sequence = f"{salt}|{status}|{additional_charges}|{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
#         else:
#             hash_sequence = f"{salt}|{status}||{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"

#         hasher = hashlib.sha512()
#         hasher.update(hash_sequence.encode('utf-8'))
#         calculated_hash = hasher.hexdigest().lower()

#         return calculated_hash == received_hash.lower()

#     @staticmethod
#     def get_payment_url():
#         """
#         Returns the PayU redirect endpoint based on sandbox/production setting.
#         """
#         if settings.PAYU_SANDBOX:
#             return "https://test.payu.in/_payment"
#         return "https://secure.payu.in/_payment"











import hashlib
from django.conf import settings

class PayUService:
    @staticmethod
    def generate_hash(txnid, amount, productinfo, firstname, email, udf1='', udf2='', udf3='', udf4='', udf5=''):
        """
        Generates payment hash to be sent to PayU.
        Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||||||SALT)
        """
        key = settings.PAYU_MERCHANT_KEY
        salt = settings.PAYU_SALT

        # Ensure values are strings and clean (convert None to empty string)
        def clean_str(value):
            return str(value) if value is not None else ''
        
        txnid = clean_str(txnid)
        amount = f"{float(amount):.2f}" if amount else '0.00'
        productinfo = clean_str(productinfo)
        firstname = clean_str(firstname)
        email = clean_str(email)
        udf1 = clean_str(udf1)
        udf2 = clean_str(udf2)
        udf3 = clean_str(udf3)
        udf4 = clean_str(udf4)
        udf5 = clean_str(udf5)

        # IMPORTANT: 10 pipes after udf5 (as per PayU specification)
        hash_sequence = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||||||{salt}"
        
        hasher = hashlib.sha512()
        hasher.update(hash_sequence.encode('utf-8'))
        return hasher.hexdigest().lower()

    @staticmethod
    def verify_response_hash(response_data):
        """
        Verifies the response hash returned from PayU.
        Formula: sha512(SALT|status|additionalCharges|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
        """
        salt = settings.PAYU_SALT
        
        # Helper to safely extract and clean values
        def safe_get(data, key, default=''):
            value = data.get(key, default)
            return str(value) if value is not None else ''
        
        # Extract all parameters
        key = safe_get(response_data, 'key')
        txnid = safe_get(response_data, 'txnid')
        amount = safe_get(response_data, 'amount')
        productinfo = safe_get(response_data, 'productinfo')
        firstname = safe_get(response_data, 'firstname')
        email = safe_get(response_data, 'email')
        status = safe_get(response_data, 'status')
        additional_charges = safe_get(response_data, 'additionalCharges')
        
        udf1 = safe_get(response_data, 'udf1')
        udf2 = safe_get(response_data, 'udf2')
        udf3 = safe_get(response_data, 'udf3')
        udf4 = safe_get(response_data, 'udf4')
        udf5 = safe_get(response_data, 'udf5')
        
        received_hash = safe_get(response_data, 'hash')

        # Standardize amount format to 2 decimal places
        try:
            amount = f"{float(amount):.2f}"
        except (ValueError, TypeError):
            amount = '0.00'

        # Create hashing pattern based on additionalCharges presence
        if additional_charges:
            hash_sequence = f"{salt}|{status}|{additional_charges}|{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
        else:
            # Note: empty additionalCharges represented as empty string between pipes
            hash_sequence = f"{salt}|{status}||{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"

        hasher = hashlib.sha512()
        hasher.update(hash_sequence.encode('utf-8'))
        calculated_hash = hasher.hexdigest().lower()

        return calculated_hash == received_hash.lower()

    @staticmethod
    def get_payment_url():
        """Returns the PayU redirect endpoint based on sandbox/production setting."""
        if settings.PAYU_SANDBOX:
            return "https://test.payu.in/_payment"
        return "https://secure.payu.in/_payment"
    
    @staticmethod
    def get_payu_form_data(txnid, amount, productinfo, firstname, email, **kwargs):
        """
        Returns complete form data to be submitted to PayU
        """
        udf1 = kwargs.get('udf1', '')
        udf2 = kwargs.get('udf2', '')
        udf3 = kwargs.get('udf3', '')
        udf4 = kwargs.get('udf4', '')
        udf5 = kwargs.get('udf5', '')
        
        hash_value = PayUService.generate_hash(
            txnid, amount, productinfo, firstname, email,
            udf1, udf2, udf3, udf4, udf5
        )
        
        return {
            'key': settings.PAYU_MERCHANT_KEY,
            'txnid': str(txnid),
            'amount': f"{float(amount):.2f}",
            'productinfo': str(productinfo),
            'firstname': str(firstname),
            'email': str(email),
            'udf1': str(udf1),
            'udf2': str(udf2),
            'udf3': str(udf3),
            'udf4': str(udf4),
            'udf5': str(udf5),
            'hash': hash_value,
            'surl': kwargs.get('surl', ''),
            'furl': kwargs.get('furl', ''),
            'curl': kwargs.get('curl', ''),
        }