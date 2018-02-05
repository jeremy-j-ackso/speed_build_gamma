# Get the couchdb Repo added.
echo "deb https://apache.bintray.com/couchdb-deb xenial main" > /etc/apt/sources.list.d/couchdb.list
curl -sL https://couchdb.apache.org/repo/bintray-pubkey.asc | apt-key add -

# Run upgrades to get up-to-date.
apt-get update -y -q
apt-get upgrade -y -q

# Set up debconf for configuring couchdb in an unattended fashion and install.
COUCHDB_PASSWORD=password
COUCHDB_BIND='0.0.0.0'

echo "couchdb couchdb/mode select standalone
couchdb couchdb/mode seen true
couchdb couchdb/bindaddress string ${COUCHDB_BIND}
couchdb couchdb/bindaddress seen true
couchdb couchdb/adminpass password ${COUCHDB_PASSWORD}
couchdb couchdb/adminpass seen true
couchdb couchdb/adminpass_again password ${COUCHDB_PASSWORD}
couchdb couchdb/adminpass_again seen true" | debconf-set-selections

DEBIAN_FRONTEND=noninteractive apt-get install -y -q couchdb

# Add the node_user.
curl -s -X PUT http://admin:password@localhost:5984/_users/org.couchdb.user:node_user \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"name": "node_user", "password": "reallysecure", "roles": ["api"], "type": "user"}'

# Add the database the node_user will be writing to.
curl -s -X PUT http://admin:password@localhost:5984/node_db

# Add the _security document granting node_user permissions on node_db.
curl -s -X PUT http://admin:password@localhost:5984/node_db/_security \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --data '{"admins": {"names": [], "roles": []}, "members": {"names": ["node_user"], "roles": ["api"]}}'

# Need a reboot because of the updates.
shutdown -r now
