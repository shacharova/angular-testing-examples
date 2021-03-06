import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CourseslISTModule } from 'src/app/features/courses/courses-list.module';
import { MOCK_COURSES } from 'src/testing/apis-mocks';

import { CoursesListComponent } from './courses-list.component';

describe('CoursesComponent', () => {
  let component: CoursesListComponent;
  let fixture: ComponentFixture<CoursesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseslISTModule, NoopAnimationsModule]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesListComponent);
        component = fixture.componentInstance;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the courses', () => {
    component.courses = MOCK_COURSES;
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.card.course'));

    expect(cards).toBeTruthy();
    expect(cards.length).toBe(MOCK_COURSES.length);
  });

  it('should display the first course', () => {
    component.courses = MOCK_COURSES;
    fixture.detectChanges();

    const firstCard = fixture.debugElement.query(By.css('.card.course:first-child'));
    const cardHeader = firstCard.query(By.css('.name'));

    expect(firstCard).toBeTruthy();
    expect(firstCard.nativeElement).toBeInstanceOf(HTMLDivElement);
    expect(cardHeader.nativeElement.textContent).toBe(component.courses[0].name);
  });
});
