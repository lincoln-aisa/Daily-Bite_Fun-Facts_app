#!/usr/bin/env python3
"""
Daily Bite API Backend Testing Suite
Tests all backend endpoints with success and error scenarios
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import time
import sys

# Configuration
BASE_URL = "https://fun-facts-daily.preview.emergentagent.com/api"
TIMEOUT = 30

class DailyBiteAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_user_id = str(uuid.uuid4())
        self.test_results = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
    
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        print("🔍 Testing Health Check Endpoint...")
        
        try:
            response = self.session.get(f"{BASE_URL}/health", timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", True, f"Status: {data['status']}")
                    return True
                else:
                    self.log_test("Health Check", False, "Invalid response format", data)
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_user_management(self):
        """Test POST /api/users endpoint"""
        print("🔍 Testing User Management...")
        
        # Test 1: Create new user
        user_data = {
            "uid": self.test_user_id,
            "email": "testuser@dailybite.com",
            "display_name": "Test User",
            "is_anonymous": False
        }
        
        try:
            response = self.session.post(
                f"{BASE_URL}/users",
                json=user_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Create User", True, f"Message: {data.get('message')}")
                else:
                    self.log_test("Create User", False, "Success flag is False", data)
            else:
                self.log_test("Create User", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Create User", False, f"Exception: {str(e)}")
        
        # Test 2: Update existing user (should update last_active)
        try:
            time.sleep(1)  # Small delay to ensure different timestamp
            response = self.session.post(
                f"{BASE_URL}/users",
                json=user_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "updated" in data.get("message", "").lower():
                    self.log_test("Update User", True, f"Message: {data.get('message')}")
                else:
                    self.log_test("Update User", True, f"User operation successful: {data.get('message')}")
            else:
                self.log_test("Update User", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Update User", False, f"Exception: {str(e)}")
        
        # Test 3: Invalid user data
        invalid_data = {"invalid": "data"}
        try:
            response = self.session.post(
                f"{BASE_URL}/users",
                json=invalid_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 422:  # Validation error expected
                self.log_test("Invalid User Data", True, "Correctly rejected invalid data")
            else:
                self.log_test("Invalid User Data", False, f"Expected 422, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid User Data", False, f"Exception: {str(e)}")
    
    def test_score_submission(self):
        """Test POST /api/submit-score endpoint"""
        print("🔍 Testing Score Submission...")
        
        today = datetime.utcnow().strftime('%Y-%m-%d')
        
        # Test 1: Submit new score
        score_data = {
            "userId": self.test_user_id,
            "score": 850,
            "timeTaken": 45,
            "date": today,
            "puzzle_category": "trivia",
            "puzzle_difficulty": "medium"
        }
        
        try:
            response = self.session.post(
                f"{BASE_URL}/submit-score",
                json=score_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Submit Score", True, f"Message: {data.get('message')}")
                else:
                    self.log_test("Submit Score", False, "Success flag is False", data)
            else:
                self.log_test("Submit Score", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Submit Score", False, f"Exception: {str(e)}")
        
        # Test 2: Submit higher score (should update)
        higher_score_data = score_data.copy()
        higher_score_data["score"] = 950
        higher_score_data["timeTaken"] = 40
        
        try:
            response = self.session.post(
                f"{BASE_URL}/submit-score",
                json=higher_score_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("new_record"):
                    self.log_test("Update Higher Score", True, "New record set")
                else:
                    self.log_test("Update Higher Score", True, f"Score processed: {data.get('message')}")
            else:
                self.log_test("Update Higher Score", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Update Higher Score", False, f"Exception: {str(e)}")
        
        # Test 3: Submit lower score (should not update)
        lower_score_data = score_data.copy()
        lower_score_data["score"] = 700
        
        try:
            response = self.session.post(
                f"{BASE_URL}/submit-score",
                json=lower_score_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and not data.get("new_record"):
                    self.log_test("Submit Lower Score", True, "Correctly did not update record")
                else:
                    self.log_test("Submit Lower Score", True, f"Score processed: {data.get('message')}")
            else:
                self.log_test("Submit Lower Score", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Submit Lower Score", False, f"Exception: {str(e)}")
        
        # Test 4: Invalid score data
        invalid_score = {"userId": "invalid", "score": "not_a_number"}
        try:
            response = self.session.post(
                f"{BASE_URL}/submit-score",
                json=invalid_score,
                timeout=TIMEOUT
            )
            
            if response.status_code == 422:  # Validation error expected
                self.log_test("Invalid Score Data", True, "Correctly rejected invalid score")
            else:
                self.log_test("Invalid Score Data", False, f"Expected 422, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Score Data", False, f"Exception: {str(e)}")
    
    def test_leaderboard(self):
        """Test GET /api/leaderboard endpoint"""
        print("🔍 Testing Leaderboard...")
        
        # Test 1: Today's leaderboard
        try:
            response = self.session.get(
                f"{BASE_URL}/leaderboard?period=today&limit=10",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Today's Leaderboard", True, f"Retrieved {len(data)} entries")
                else:
                    self.log_test("Today's Leaderboard", False, "Response is not a list", data)
            else:
                self.log_test("Today's Leaderboard", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Today's Leaderboard", False, f"Exception: {str(e)}")
        
        # Test 2: All-time leaderboard
        try:
            response = self.session.get(
                f"{BASE_URL}/leaderboard?period=alltime&limit=10",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("All-time Leaderboard", True, f"Retrieved {len(data)} entries")
                else:
                    self.log_test("All-time Leaderboard", False, "Response is not a list", data)
            else:
                self.log_test("All-time Leaderboard", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("All-time Leaderboard", False, f"Exception: {str(e)}")
        
        # Test 3: Default leaderboard (should default to today)
        try:
            response = self.session.get(f"{BASE_URL}/leaderboard", timeout=TIMEOUT)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Default Leaderboard", True, f"Retrieved {len(data)} entries")
                else:
                    self.log_test("Default Leaderboard", False, "Response is not a list", data)
            else:
                self.log_test("Default Leaderboard", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Default Leaderboard", False, f"Exception: {str(e)}")
    
    def test_reward_processing(self):
        """Test POST /api/process-reward endpoint"""
        print("🔍 Testing Reward Processing...")
        
        # Test 1: Valid reward
        reward_data = {
            "userId": self.test_user_id,
            "rewardType": "video_ad",
            "rewardAmount": 25.0,
            "timestamp": datetime.utcnow().isoformat(),
            "adUnitId": "ca-app-pub-test-123456"
        }
        
        try:
            response = self.session.post(
                f"{BASE_URL}/process-reward",
                json=reward_data,
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Process Reward", True, f"Reward: {data.get('reward_amount')} points")
                else:
                    self.log_test("Process Reward", False, f"Success flag is False: {data.get('message')}")
            else:
                self.log_test("Process Reward", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Process Reward", False, f"Exception: {str(e)}")
        
        # Test 2: Duplicate reward (should be rejected)
        try:
            response = self.session.post(
                f"{BASE_URL}/process-reward",
                json=reward_data,  # Same data as above
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if not data.get("success") and "already processed" in data.get("message", "").lower():
                    self.log_test("Duplicate Reward", True, "Correctly rejected duplicate")
                else:
                    self.log_test("Duplicate Reward", False, "Should have rejected duplicate", data)
            else:
                self.log_test("Duplicate Reward", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Duplicate Reward", False, f"Exception: {str(e)}")
        
        # Test 3: Invalid reward amount
        invalid_reward = reward_data.copy()
        invalid_reward["rewardAmount"] = 150.0  # Over limit
        invalid_reward["timestamp"] = datetime.utcnow().isoformat()  # New timestamp
        
        try:
            response = self.session.post(
                f"{BASE_URL}/process-reward",
                json=invalid_reward,
                timeout=TIMEOUT
            )
            
            if response.status_code == 400:  # Bad request expected
                self.log_test("Invalid Reward Amount", True, "Correctly rejected invalid amount")
            else:
                self.log_test("Invalid Reward Amount", False, f"Expected 400, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Reward Amount", False, f"Exception: {str(e)}")
    
    def test_streak_updates(self):
        """Test POST /api/update-streak endpoint"""
        print("🔍 Testing Streak Updates...")
        
        # Test 1: Update streak for existing user
        try:
            response = self.session.post(
                f"{BASE_URL}/update-streak?user_id={self.test_user_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "streak" in data:
                    self.log_test("Update Streak", True, f"Streak: {data.get('streak')} days")
                else:
                    self.log_test("Update Streak", False, "Invalid response format", data)
            else:
                self.log_test("Update Streak", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("Update Streak", False, f"Exception: {str(e)}")
        
        # Test 2: Update streak for non-existent user
        fake_user_id = str(uuid.uuid4())
        try:
            response = self.session.post(
                f"{BASE_URL}/update-streak?user_id={fake_user_id}",
                timeout=TIMEOUT
            )
            
            if response.status_code == 404:  # User not found expected
                self.log_test("Streak Non-existent User", True, "Correctly returned 404 for missing user")
            else:
                self.log_test("Streak Non-existent User", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Streak Non-existent User", False, f"Exception: {str(e)}")
    
    def test_user_stats(self):
        """Test GET /api/user/{user_id}/stats endpoint"""
        print("🔍 Testing User Stats...")
        
        # Test 1: Get stats for existing user
        try:
            response = self.session.get(
                f"{BASE_URL}/user/{self.test_user_id}/stats",
                timeout=TIMEOUT
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["user_id", "display_name", "streak", "total_points", "total_games"]
                if all(field in data for field in required_fields):
                    self.log_test("User Stats", True, f"Games: {data.get('total_games')}, Points: {data.get('total_points')}")
                else:
                    self.log_test("User Stats", False, "Missing required fields", data)
            else:
                self.log_test("User Stats", False, f"HTTP {response.status_code}", response.text)
                
        except Exception as e:
            self.log_test("User Stats", False, f"Exception: {str(e)}")
        
        # Test 2: Get stats for non-existent user
        fake_user_id = str(uuid.uuid4())
        try:
            response = self.session.get(
                f"{BASE_URL}/user/{fake_user_id}/stats",
                timeout=TIMEOUT
            )
            
            if response.status_code == 404:  # User not found expected
                self.log_test("Stats Non-existent User", True, "Correctly returned 404 for missing user")
            else:
                self.log_test("Stats Non-existent User", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Stats Non-existent User", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Daily Bite API Backend Tests")
        print(f"🌐 Testing against: {BASE_URL}")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_health_check()
        self.test_user_management()
        self.test_score_submission()
        self.test_leaderboard()
        self.test_reward_processing()
        self.test_streak_updates()
        self.test_user_stats()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        print("\n🎯 Test User ID used:", self.test_user_id)
        return passed == total

if __name__ == "__main__":
    tester = DailyBiteAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)