import pyodbc
import json

#define database/server
server = 'jjalss.database.windows.net'
database = 'jjal'
username = 'jjal'
password = 'Tarc1234.'
driver= '{ODBC Driver 17 for SQL Server}'

#define empty arrays/lists
inviDValue = []
      
def getInvigilatorDetailsFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT staffID, staffName, password FROM Invigilator;
                            """)
            row = cursor.fetchone()
            while row:
                inviDValue.append(
                    {"staffid" : str(row[0]),
                     "name" : str(row[1]),
                    "password" : str(row[2])})
                row = cursor.fetchone()


#call function
getInvigilatorDetailsFromDB()

#convert to dictionary/object
dictData = {"inviDetails" : inviDValue}

#convert to JSON
data = json.dumps(dictData)

#print data
print(data)
