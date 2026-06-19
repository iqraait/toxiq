# test_payu_hash.py
import hashlib

def test_payu_hash_with_original():
    # Your original credentials
    key = "BBPCSI"  # Your merchant key
    salt = "ETbZpK6lPK2LcMGERfHcD5gXMsDaEgFl"  # Your salt
    
    # Test transaction data
    txnid = "TXN123456789"
    amount = "100.00"
    productinfo = "Test Product"
    firstname = "John Doe"
    email = "john@example.com"
    udf1 = ""
    udf2 = ""
    udf3 = ""
    udf4 = ""
    udf5 = ""
    
    # Try both pipe counts to see which one works
    print("=" * 60)
    print("TEST 1: 6 pipes after udf5 (Recommended)")
    print("=" * 60)
    hash_string_6 = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
    print(f"Hash String: {hash_string_6}")
    hash_value_6 = hashlib.sha512(hash_string_6.encode('utf-8')).hexdigest().lower()
    print(f"Hash (6 pipes): {hash_value_6}")
    print(f"Hash Length: {len(hash_value_6)}")
    
    print("\n" + "=" * 60)
    print("TEST 2: 10 pipes after udf5")
    print("=" * 60)
    hash_string_10 = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||||||{salt}"
    print(f"Hash String: {hash_string_10}")
    hash_value_10 = hashlib.sha512(hash_string_10.encode('utf-8')).hexdigest().lower()
    print(f"Hash (10 pipes): {hash_value_10}")
    print(f"Hash Length: {len(hash_value_10)}")
    
    print("\n" + "=" * 60)
    print("TEST 3: 11 pipes after udf5")
    print("=" * 60)
    hash_string_11 = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}|||||||||||{salt}"
    print(f"Hash String: {hash_string_11}")
    hash_value_11 = hashlib.sha512(hash_string_11.encode('utf-8')).hexdigest().lower()
    print(f"Hash (11 pipes): {hash_value_11}")
    print(f"Hash Length: {len(hash_value_11)}")
    
    return {
        '6_pipes': hash_value_6,
        '10_pipes': hash_value_10,
        '11_pipes': hash_value_11
    }

def test_with_payu_official_test_credentials():
    """Test with PayU's official test credentials for comparison"""
    print("\n" + "=" * 60)
    print("TEST WITH PAYU OFFICIAL TEST CREDENTIALS")
    print("=" * 60)
    
    key = "gtKFFx"  # Official PayU test key
    salt = "eCwWELxi"  # Official PayU test salt
    txnid = "TXN123456"
    amount = "100.00"
    productinfo = "Test Product"
    firstname = "John Doe"
    email = "john@example.com"
    udf1 = ""
    udf2 = ""
    udf3 = ""
    udf4 = ""
    udf5 = ""
    
    # 6 pipes (correct format)
    hash_string = f"{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|{udf1}|{udf2}|{udf3}|{udf4}|{udf5}||||||{salt}"
    print(f"Hash String: {hash_string}")
    hash_value = hashlib.sha512(hash_string.encode('utf-8')).hexdigest().lower()
    print(f"Hash: {hash_value}")
    print(f"Hash Length: {len(hash_value)}")
    
    return hash_value

if __name__ == "__main__":
    print("TESTING WITH YOUR ORIGINAL CREDENTIALS")
    print("Merchant Key: BBPCSI")
    print("Salt: ETbZpK6lPK2LcMGERfHcD5gXMsDaEgFl")
    print()
    
    results = test_payu_hash_with_original()
    
    print("\n" + "=" * 60)
    print("COMPARISON RESULTS")
    print("=" * 60)
    print(f"6 pipes hash:  {results['6_pipes']}")
    print(f"10 pipes hash: {results['10_pipes']}")
    print(f"11 pipes hash: {results['11_pipes']}")
    
    # Test with official credentials
    test_with_payu_official_test_credentials()
    
    print("\n" + "=" * 60)
    print("IMPORTANT NOTES")
    print("=" * 60)
    print("1. 'BBPCSI' might not be a valid merchant key - it appears to be a demo key")
    print("2. Contact PayU support to get valid merchant credentials")
    print("3. The hash format with 6 pipes after udf5 is the correct one")
    print("4. All hashes should be 128 characters long (SHA-512)")