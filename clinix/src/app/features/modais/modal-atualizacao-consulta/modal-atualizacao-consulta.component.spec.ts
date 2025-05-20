import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAtualizacaoConsultaComponent } from './modal-atualizacao-consulta.component';

describe('ModalAtualizacaoConsultaComponent', () => {
  let component: ModalAtualizacaoConsultaComponent;
  let fixture: ComponentFixture<ModalAtualizacaoConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAtualizacaoConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAtualizacaoConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
