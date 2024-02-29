import pyodbc
import json

#define database/server
server = 'jjalss.database.windows.net'
database = 'jjal'
username = 'jjal'
password = 'Tarc1234.'
driver= '{ODBC Driver 17 for SQL Server}'

#define empty arrays/lists
examValue = []
totalValue = []
barredValue = []
presentValue = []

def getExamFromDB():
    with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT C.courseCode, C.courseTitle, examDate, examStartTime, examEndTime, venueName  
                            FROM Examination E, Venue V, Course C
                            WHERE E.venueID = V.venueID AND E.courseCode = C.courseCode
                            ORDER BY examDate;
                            """)
            row = cursor.fetchone()
            while row:
                examValue.append(
                    {"course" : str(row[0]),
                    "title" : str(row[1]),
                    "date" : str(row[2]), 
                    "startTime" : str(row[3]), 
                    "endTime" : str(row[4]), 
                    "venue" : str(row[5])})
                row = cursor.fetchone()

                
def getTotalStudentFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT courseCode, COUNT(candidateID)
                            FROM Examination E, Seat_Assignment SA
                            WHERE E.examCode = SA.examCode
                            GROUP BY E.courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                totalValue.append(
                    {"course" : str(row[0]), 
                    "count" : str(row[1])})
                row = cursor.fetchone()
                
def getBarredStudentFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT courseCode, COUNT(candidateID)
                            FROM Examination E, Seat_Assignment SA
                            WHERE E.examCode = SA.examCode AND status IN ('Barred')
                            GROUP BY courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                barredValue.append(
                    {"course" : str(row[0]), 
                    "count" : str(row[1])})
                row = cursor.fetchone()
                
def getPresentStudentFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT courseCode, COUNT(candidateID)
                            FROM Examination E, Seat_Assignment SA
                            WHERE E.examCode = SA.examCode AND status IN ('Present')
                            GROUP BY courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                presentValue.append(
                    {"course" : str(row[0]), 
                    "count" : str(row[1])})
                row = cursor.fetchone()

#call function
getExamFromDB()
getTotalStudentFromDB()
getBarredStudentFromDB()
getPresentStudentFromDB()

#convert to dictionary/object
dictData = {"exam" : examValue,
            "total" : totalValue,
            "barred" : barredValue,
            "present" : presentValue}

#convert to JSON
data = json.dumps(dictData)

#print data
print(data)
