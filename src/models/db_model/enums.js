export default db_enums = {
      COURSES: {
        COURSE_CATEGORY: ["Adults", "Teens", "Seniors", "Disabilities", "Other"],
        COURSE_TYPE: ["Class", "Driving", "Evaluation"]
      },
      LOCATIONS: {
        LOCATION_TYPE: ["On Site", "Web Browser", "Student Designated"]
      },
      PAYMENTS: {
        PAYMENT_METHOD: ["Credit Card", "Check", "Cash", "Afterpay"],
        PAYMENT_STATUS: ["Pending", "Completed", "Failed"]
      },
      CHARGES: {
        PAYMENT_STATUS: ["Pending", "Partially Paid", "Paid"]
      },
      USERS: {
        USER_TYPE: ["ADMIN", "INSTRUCTOR", "STUDENT", "OFFICE"],
        GENDER: ["F", "M", "OTHER"]
      }

};


