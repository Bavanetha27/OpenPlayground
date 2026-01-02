import random
import string

def generate_password(length: int, include_upper: bool, include_lower: bool, 
                     include_digits: bool, include_special: bool) -> str:
    chars = ''
    if include_lower:
        chars += string.ascii_lowercase
    if include_upper:
        chars += string.ascii_uppercase
    if include_digits:
        chars += string.digits
    if include_special:
        chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    if not chars:
        raise ValueError("Select at least one character type")
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password
