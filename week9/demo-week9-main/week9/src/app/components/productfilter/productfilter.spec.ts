import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { model } from '@angular/core';
import { Productfilter } from './productfilter';

describe('Productfilter', () => {
  let component: Productfilter;
  let fixture: ComponentFixture<Productfilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productfilter,FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productfilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filterCriteria','a')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.filter()).toBe('a');
  });
});
