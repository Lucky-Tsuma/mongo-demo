const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to database...'))
    .catch(err => console.error('Error connecting to database: ', err))

// Creating a schema
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
})

// Creating a model(Class)
const Course = mongoose.model('Course', courseSchema)

async function createCourse () {
    try {
        // Creating an instance of a model, which maps to a docunent in our database
        const course = new Course({
            name: 'Node.js Course',
            author: 'Tsuma',
            tags: [ 'Mongodb', 'Mongoose' ],
            isPublished: false
        })
        
        const result = await course.save()
        console.log(result)
    } catch (err) {
        console.log('Error creating course: ', err)
    }
}

async function getCourses() {
    // pageNumber and pageSize used to implement pagination
    const pageNumber = 2
    const pageSize = 10
    // Comparison operators: 
        // eq => equal
        // ne => not equal
        // gt => greater than
        // gte => greater than or equal to
        // lt => less than
        // lte => less than or equal to
        // in 
        // nin => not in

        // suppose our document had a price property, here is how we'd fetch different values using the above operators
            // priced more than 10 .find({ price: { $gt: 10 } })
            // priced btwn 10 and 20 .find({ price: { $gte: 10, $lte: 20 } })
            // priced  10 or 15 or 20 .find({ price: { $in: [10, 15, 20] } })

    // Logical operators: 
        // or
        // and
        // syntax is the same. suppose we want to find courses that were authored by Mosh or courses that were published: 
            // .find().or([ { author: 'Mosh' }, { isPublished: true } ])
            // exact same sytax is used for the and operator
    try {
        const courses = await Course
                                .find({ author: 'Mosh', isPublished: true}) // we added a filter to the find method, optional.
                                .skip((pageNumber - 1) * pageSize) //to escape previous documents, pagination
                                .limit(pageSize) // setting a limit on the number of docs to return (optional)
                                .sort({ name: 1 }) //sort by name 1 => ascending, -1 => descending
                                .select({ name: 1, tags: 1}) //to specify the properties we want returned. optional

        console.log(courses)
    } catch (err) {
        console.log('Error fetching courses: ', err)
    }
}

createCourse()
// getCourses()
