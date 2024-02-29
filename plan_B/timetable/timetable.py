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


#call function
getExamFromDB()


#convert to dictionary/object
dictData = {"exam" : examValue}

#convert to JSON
data = json.dumps(dictData)

#print data
print(data)
