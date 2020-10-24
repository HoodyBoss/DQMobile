import { Injectable } from '@angular/core';
import { courseList } from './course-data';


@Injectable()
export class CourseService {

    public course = courseList;

    public getCourse() {
        return this.course;
    }
}
