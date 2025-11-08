import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasComponente } from './notas';

describe('NotasComponente', () => {
  let component: NotasComponente;
  let fixture: ComponentFixture<NotasComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
