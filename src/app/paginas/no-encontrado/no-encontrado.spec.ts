import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoEncontradoComponente } from './no-encontrado';

describe('NoEncontrado', () => {
  let component: NoEncontradoComponente;
  let fixture: ComponentFixture<NoEncontradoComponente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoEncontradoComponente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoEncontradoComponente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
