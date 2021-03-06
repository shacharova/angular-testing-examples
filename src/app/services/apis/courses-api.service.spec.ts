import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CoursesApiService } from './courses-api.service';
import { MOCK_LESSONS, MOCK_COURSES } from 'src/testing/apis-mocks';
import { ICourse } from './apis-interfaces';

describe('CoursesApiService', () => {
  let service: CoursesApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesApiService,
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(CoursesApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpTestingController.verify(); // Make sure no real request is made
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrive all courses', () => {
    service.getAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy();
      expect(courses.length).toBe(MOCK_COURSES.length);
      const course = courses.find(course => course.id === 2);
      expect(course?.name).toBe(MOCK_COURSES.find(c => c.id === 2)?.name);
    });

    // Expect single request to a given url:
    const requestTest = httpTestingController.expectOne('/api/courses');
    expect(requestTest.request.method).toBe("GET");

    requestTest.flush({ data: MOCK_COURSES });
  });

  it('should retrive a course by id', () => {
    service.getCourseById(5).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(5);
    });

    // Expect single request to a given url:
    const requestTest = httpTestingController.expectOne('/api/courses/5');
    expect(requestTest.request.method).toBe("GET");

    requestTest.flush({ data: MOCK_COURSES.find(course => course.id === 5) });
  });

  it('should save the course data', () => {
    const courseChanges: Partial<ICourse> = { name: 'Another Course Name' };
    service.saveCourse(5, courseChanges).subscribe((course) => {
      expect(course?.id).toBe(5);
      expect(course?.name).toBe('Another Course Name');
    });

    const requestTest = httpTestingController.expectOne('/api/courses/5');
    expect(requestTest.request.method).toBe('PUT');
    expect(requestTest.request.body.name).toBe('Another Course Name');

    const course = MOCK_COURSES.find(course => course.id === 5);
    requestTest.flush({ data: { ...course, ...courseChanges } });
  });

  it('should give an error if save course data failed', () => {
    const courseChanges: Partial<ICourse> = { name: 'Hadar' };
    service.saveCourse(5, courseChanges).subscribe({
      next: (course: ICourse) => {
        fail('The save course should have an error');
      },
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    });

    const requestTest = httpTestingController.expectOne('/api/courses/5');
    expect(requestTest.request.method).toBe('PUT');
    requestTest.flush('save course failed', { status: 500, statusText: 'Internal server error' });
  });

  it('shold retrive a list of lessons', () => {
    const lessonsOfCourse = MOCK_LESSONS.filter(lesson => lesson.courseId === 5);

    service.getLessons(5).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(lessonsOfCourse.length);
    });

    const requestTest = httpTestingController.expectOne((req) => req.url === '/api/lessons');
    expect(requestTest.request.method).toBe("GET");
    
    expect(requestTest.request.params.get('courseId')).toBe('5');
    expect(requestTest.request.params.get('searchText')).toBe('');
    expect(requestTest.request.params.get('sortOrder')).toBe('asc');
    expect(requestTest.request.params.get('pageNumber')).toBe('0');
    expect(requestTest.request.params.get('pageSize')).toBe('3');
    
    requestTest.flush({ data: lessonsOfCourse });
  });



});
