
# 1. Register a new MANAGER (to ensure fresh user/token)
echo "Registering..."
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Manager","email":"manager_test_1@example.com","password":"password123","role":"MANAGER"}'

echo "\n\nLogging in..."
# 2. Login to get token
TOKEN=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager_test_1@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "\nToken: $TOKEN"

echo "\n\nAccessing Protected Route..."
# 3. Access protected route
curl -v -X GET http://localhost:5001/api/incidents/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
