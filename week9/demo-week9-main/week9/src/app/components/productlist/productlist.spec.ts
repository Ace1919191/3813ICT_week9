import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Productlist } from './productlist';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Productlist', () => {
  let component: Productlist;
  let fixture: ComponentFixture<Productlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productlist],
      providers:[ provideHttpClient(),
  provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productlist);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('listCriteria', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
