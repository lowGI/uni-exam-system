import pyodbc
import json
from tkinter import *


#define database/server
server = 'jjalss.database.windows.net'
database = 'jjal'
username = 'jjal'
password = 'Tarc1234.'
driver= '{ODBC Driver 17 for SQL Server}'

#define empty arrays/lists
examValue = []
attValue = []
totalValue = []
barredValue = []
presentValue = []
inviValue = []
inviDValue = []
inviVenueAssValue = []
totalStudByVenueValue = []
nullValue = []
capacityValue = []

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
            cursor.execute("""SELECT DISTINCT S.indexNo, studentName, S.programmeCode,  venueName, seatNumber, C.courseCode, status
                            FROM Examination E, Student S, Seat_Assignment SA, Programme P, Course C, Venue V
                            WHERE S.indexNo = SA.indexNo AND SA.examCode = E.examCode AND 
                                E.courseCode = C.courseCode AND E.venueID = V.venueID
                            ORDER BY venueName, seatNumber""")
            row = cursor.fetchone()
            while row:
                attValue.append(
                    {"indexNo" : str(row[0]), 
                    "studentName" : str(row[1]), 
                    "programmeCode" : str(row[2]),
                    "venue" : str(row[3]),
                    "seat" : str(row[4]),
                    "course" : str(row[5]),
                    "status" : str(row[6])})
                row = cursor.fetchone()
                
def getTotalStudentFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT courseCode, COUNT(indexNo)
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
            cursor.execute("""SELECT courseCode, COUNT(indexNo)
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
            cursor.execute("""SELECT courseCode, COUNT(indexNo)
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
                
def getInvigilatorsFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT DISTINCT I.staffID, I.staffName, courseCode, venueName
                            FROM Invigilator I, Invigilator_Assignment IA, Examination E, Venue V
                            WHERE E.examCode = IA.examCode AND IA.staffID = I.staffID AND IA.venueID = V.venueID
                            ORDER BY courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                inviValue.append(
                    {"staffid" : str(row[0]), 
                    "name" : str(row[1]),
                    "course" : str(row[2]),
                    "venue" : str(row[3])})
                row = cursor.fetchone()
                
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
                
def getInvigilatorAssVenueFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT E.venueID, venueName, examDate, examStartTime, examEndTime, COUNT(staffID)
                            FROM Invigilator_Assignment IA, Venue V, Examination E
                            WHERE V.venueID = IA.venueID AND IA.examCode = E.examCode 
                            GROUP BY E.venueID, venueName, examDate, examStartTime, examEndTime
                            ORDER BY E.venueID, examDate, examStartTime;
                            """)
            row = cursor.fetchone()
            while row:
                inviVenueAssValue.append(
                    {"venueid" : str(row[0]),
                     "venue" : str(row[1]),
                     "date" : str(row[2]),
                     "starttime" : str(row[3]),
                     "endtime" : str(row[4]),
                     "count" : str(row[5])})
                row = cursor.fetchone()
                
def getTotalStudByVenueFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT V.venueID, venueName, examDate, examStartTime, examEndTime, COUNT(indexNo)
                            FROM Venue V, Examination E, Seat_Assignment SA
                            WHERE V.venueID = E.venueID AND E.examCode = SA.examCode AND status NOT IN ('Barred')
                            GROUP BY V.venueID, venueName, examDate, examStartTime, examEndTime
                            ORDER BY V.venueID, examDate, examStartTime;
                            """)
            row = cursor.fetchone()
            while row:
                totalStudByVenueValue.append(
                    {"venueid" : str(row[0]),
                     "venue" : str(row[1]),
                     "date" : str(row[2]),
                     "starttime" : str(row[3]),
                     "endtime" : str(row[4]),
                     "count" : str(row[5])})
                row = cursor.fetchone()
                
def getNullStudentFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT courseCode, examDate, examEndTime, COUNT(indexNo)
                            FROM Examination E, Seat_Assignment SA
                            WHERE E.examCode = SA.examCode AND status IN ('Null')
                            GROUP BY E.courseCode, examDate, examEndTime
                            ORDER BY courseCode;
                            """)
            row = cursor.fetchone()
            while row:
                nullValue.append(
                    {"course" : str(row[0]),
                     "examDate" : str(row[1]),
                     "endTime" : str(row[2]),
                    "count" : str(row[3])})
                row = cursor.fetchone()

def getCapacityFromDB():
     with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT venueID, capacity FROM Venue;
                            """)
            row = cursor.fetchone()
            while row:
                capacityValue.append(
                    {"venueid" : str(row[0]), 
                    "capacity" : str(row[1])})
                row = cursor.fetchone()


# creates a Tk() object
mainWindow = Tk()
mainWindow.title("Database Connector")
# sets the geometry of main
# root window
mainWindow.geometry("400x490")

def getAllFromDB():
    #call function
    getExamFromDB()
    getAttendanceFromDB()
    getTotalStudentFromDB()
    getBarredStudentFromDB()
    getPresentStudentFromDB()
    getInvigilatorsFromDB()
    getInvigilatorDetailsFromDB()
    getInvigilatorAssVenueFromDB()
    getTotalStudByVenueFromDB()
    getNullStudentFromDB()
    getCapacityFromDB()

    #convert to dictionary/object
    dictData = {"exam" : examValue,
            "attendance" : attValue,
            "total" : totalValue,
            "barred" : barredValue,
            "present" : presentValue,
            "invigilators" : inviValue,
            "inviDetails" : inviDValue,
            "inviVenueAss" : inviVenueAssValue,
            "totalStudByVenue" : totalStudByVenueValue,
            "null" : nullValue,
            "capacity" : capacityValue}

    #convert to JSON
    data = json.dumps(dictData)

    #for checking
    print(data)

    #write to file
    try:
        f = open("data.txt", "w")
        f.write(data)
        f.close()
        print("File overwrite.")
    except Exception as e:
        print(e)
        
    mainWindow.destroy()

def main():
    bg = PhotoImage(file="database.png")
    label0 = Label(mainWindow,image=bg)
    label0.pack()
    label1 = Label(mainWindow,text="Database Connecter",font=("Arial bold",25))
    label1.pack()
    label2 = Label(mainWindow,text="by NoobMaster69\n",font=("Arial italic",13))
    label2.pack()
    btn1 = Button(mainWindow,text="Connect",command=getAllFromDB,width=15,font=("Arial",13),border=6,padx=10,pady=3)
    btn1.pack()

    # mainloop, runs infinitely
    mainWindow.mainloop()
    
if __name__ == "__main__":
    main()

