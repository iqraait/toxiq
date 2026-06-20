import hashlib
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class PayUService:
    @staticmethod
    def generate_hash(txnid, amount, productinfo, firstname, email, udf1='', udf2='', udf3='', udf4='', udf5=''):
        """
        Generates payment hash to be sent to PayU.
        Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
        """
        logger.warning(f"PAYU MODE = {'TEST' if settings.PAYU_SANDBOX else 'LIVE'}")
        logger.warning(f"PAYU URL = {PayUService.get_payment_url()}")

        key = settings.PAYU_MERCHANT_KEY
        salt = settings.PAYU_SALT

        # Ensure values are strings and clean
        txnid = str(txnid)
        amount = f"{float(amount):.2f}"
        productinfo = str(productinfo)
        firstname = str(firstname)
        email = str(email)

        hash_sequence = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
        
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
        
        # Extracted parameters
        key = response_data.get('key', '')
        txnid = response_data.get('txnid', '')
        amount = response_data.get('amount', '')
        productinfo = response_data.get('productinfo', '')
        firstname = response_data.get('firstname', '')
        email = response_data.get('email', '')
        status = response_data.get('status', '')
        additional_charges = response_data.get('additionalCharges', '')
        
        udf1 = response_data.get('udf1', '')
        udf2 = response_data.get('udf2', '')
        udf3 = response_data.get('udf3', '')
        udf4 = response_data.get('udf4', '')
        udf5 = response_data.get('udf5', '')
        
        received_hash = response_data.get('hash', '')

        # Standardize amount format to 2 decimal places if needed
        try:
            amount = f"{float(amount):.2f}"
        except ValueError:
            pass

        # Create hashing pattern
        if additional_charges:
            hash_sequence = f"{salt}|{status}|{additional_charges}|{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
        else:
            hash_sequence = f"{salt}|{status}||{udf5}|{udf4}|{udf3}|{udf2}|{udf1}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"

        hasher = hashlib.sha512()
        hasher.update(hash_sequence.encode('utf-8'))
        calculated_hash = hasher.hexdigest().lower()

        return calculated_hash == received_hash.lower()

    @staticmethod
    def get_payment_url():
        """
        Returns the PayU redirect endpoint based on sandbox/production setting.
        """
        if settings.PAYU_SANDBOX:
            return "https://test.payu.in/_payment"
        return "https://secure.payu.in/_payment"





