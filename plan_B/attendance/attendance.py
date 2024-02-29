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
attValue = []

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


def getAttendanceFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT DISTINCT S.candidateID, studentName, S.programmeCode, C.courseCode, status
                            FROM Examination E, Student S, Seat_Assignment SA, Programme P, Course C
                            WHERE S.candidateID = SA.candidateID AND SA.examCode = E.examCode AND 
                                E.courseCode = C.courseCode
                            ORDER BY studentName""")
            row = cursor.fetchone()
            while row:
                attValue.append(
                    {"candidateID" : str(row[0]), 
                    "studentName" : str(row[1]), 
                    "programmeCode" : str(row[2]), 
                    "course" : str(row[3]),
                    "status" : str(row[4])})
                row = cursor.fetchone()
                
#call function
getExamFromDB()
getAttendanceFromDB()


#convert to dictionary/object
dictData = {"exam" : examValue,
            "attendance" : attValue}

#convert to JSON
data = json.dumps(dictData)

#print data
print(data)
