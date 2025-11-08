import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Riesgo } from './riesgo';

describe('Riesgo', () => {
  let component: Riesgo;
  let fixture: ComponentFixture<Riesgo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Riesgo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Riesgo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
