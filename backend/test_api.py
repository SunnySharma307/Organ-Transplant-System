import requests
import time
import sys

def test_backend():
    print("Waiting for server to start...")
    for i in range(10):
        try:
            r = requests.get("http://127.0.0.1:8000/")
            if r.status_code == 200:
                print("Server is up!")
                break
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    else:
        print("Server failed to start.")
        sys.exit(1)

    print("Testing /match/4911...")
    try:
        r = requests.post("http://127.0.0.1:8000/match/4911")
        if r.status_code == 200:
            data = r.json()
            print("Response received.")
            matches = data.get("matches", [])
            print(f"Found {len(matches)} matches.")
            if len(matches) > 0:
                first = matches[0]
                print(f"Top match score: {first.get('score')}")
                print(f"Privacy note: {first.get('privacy_note')}")
                print(f"Distance: {first.get('distance_km')} km")
                
                required_fields = ["score", "privacy_note", "distance_km", "score_breakdown", "success_probability"]
                missing = [f for f in required_fields if f not in first]
                
                if not missing:
                    sp = first.get("success_probability")
                    if 0 <= sp <= 100:
                        print("SUCCESS: Endpoint returned expected structure with all new fields. Range valid.")
                    else:
                        print(f"FAILURE: success_probability {sp} out of range (0-100).")
                        sys.exit(1)
                else:
                    print(f"FAILURE: Missing expected fields: {missing}")
                    sys.exit(1)
            else:
                print("WARNING: No matches found (validation logic might be too strict or data issue).")
        else:
            print(f"FAILURE: Status code {r.status_code}")
            print(r.text)
            sys.exit(1)
    except Exception as e:
        print(f"FAILURE: Exception {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_backend()
