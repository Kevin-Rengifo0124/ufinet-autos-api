import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCar } from './post-car';

describe('PostCar', () => {
  let component: PostCar;
  let fixture: ComponentFixture<PostCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
