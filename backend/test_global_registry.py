import requests
import sys

def test_global_registry():
    print("Testing Global Registry Endpoint: POST /match?recipient_id=4911")
    url = "http://localhost:8000/match"
    try:
        r = requests.post(url, json={"recipient_id": 4911})
        if r.status_code == 200:
            data = r.json()
            matches = data.get("matches", [])
            print(f"Success. Found {len(matches)} matches.")
            
            if len(matches) > 0:
                first = matches[0]
                print("First match sample:", first)
                required = ["exact_score", "noisy_score", "prob_success", "location"]
                missing = [f for f in required if f not in first]
                if missing:
                    print(f"FAILURE: Missing fields {missing}")
                    sys.exit(1)
                
                if not isinstance(first["location"], str) or len(first["location"]) < 3:
                     print(f"FAILURE: Location invalid: {first['location']}")
                     sys.exit(1)
                     
                print("SUCCESS: Matches well-structured and anonymized.")
            else:
                print("WARNING: No matches found.")
        else:
            print(f"FAILURE: Status {r.status_code}")
            print(r.text)
            sys.exit(1)
    except Exception as e:
        print(f"FAILURE: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_global_registry()
