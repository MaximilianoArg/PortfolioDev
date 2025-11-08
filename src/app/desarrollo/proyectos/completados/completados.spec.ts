import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Completados } from './completados';

describe('Completados', () => {
  let component: Completados;
  let fixture: ComponentFixture<Completados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Completados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Completados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
