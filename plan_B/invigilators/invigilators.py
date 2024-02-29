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
inviValue = []

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

                
def getInvigilatorsFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT DISTINCT I.staffID, I.staffName, courseCode
                            FROM Invigilator I, Invigilator_Assignment IA, Examination E
                            WHERE E.examCode = IA.examCode AND IA.staffID = I.staffID
                            ORDER BY courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                inviValue.append(
                    {"staffid" : str(row[0]), 
                    "name" : str(row[1]),
                    "course" : str(row[2])})
                row = cursor.fetchone()
                


#call function
getExamFromDB()
getInvigilatorsFromDB()


#convert to dictionary/object
dictData = {"exam" : examValue,
            "invigilators" : inviValue}

#convert to JSON
data = json.dumps(dictData)

#print data
print(data)
