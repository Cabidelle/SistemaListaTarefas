import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Tarefa, TarefaService } from './tarefa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tarefas: Tarefa[] = [];
  tarefaAtual: Tarefa = { nome: '', custo: 0, dataLimite: '' };
  editando = false;
  custoTotal = 0;

  @ViewChild('taskDialog') dialog!: ElementRef<HTMLDialogElement>;

  constructor(private service: TarefaService) { }

  ngOnInit() {
    this.carregarTarefas();
  }

  carregarTarefas() {
    this.service.getTarefas().subscribe(lista => {
      this.tarefas = lista;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.custoTotal = this.tarefas.reduce((acc, curr) => acc + curr.custo, 0);
  }

  private formatarDataParaInput(data: string | Date): string {
    const dataObj = new Date(data);
    const dataUTC = new Date(dataObj.getUTCFullYear(), dataObj.getUTCMonth(), dataObj.getUTCDate());

    return dataUTC.toISOString().split('T')[0];
  }

  abrirModal(tarefa: Tarefa | null) {
    if (tarefa) {
      this.editando = true;

      this.tarefaAtual = {
        ...tarefa,
        dataLimite: this.formatarDataParaInput(tarefa.dataLimite)
      };
    } else {
      this.editando = false;
      this.tarefaAtual = { nome: '', custo: 0, dataLimite: '' };
    }
    (this.dialog.nativeElement as any).showModal();
  }

  fecharModal() {
    (this.dialog.nativeElement as any).close();
  }

  salvar() {
    if (!this.tarefaAtual.nome) {
      alert('O Nome da tarefa é obrigatório.');
      return;
    }

    if (this.tarefaAtual.custo === null || this.tarefaAtual.custo === undefined || this.tarefaAtual.custo.toString() === '') {
      alert('O Custo é obrigatório.');
      return;
    }

    if (this.tarefaAtual.custo < 0) {
      alert('O Custo não pode ser negativo.');
      return;
    }

    if (!this.tarefaAtual.dataLimite) {
      alert('A Data Limite é obrigatória.');
      return;
    }

    if (this.editando) {
      this.service.updateTarefa(this.tarefaAtual).subscribe({
        next: () => {
          this.carregarTarefas();
          this.fecharModal();
        },
        error: (e) => alert(e.error || 'Erro ao editar. Verifique se o nome já existe.')
      });
    } else {
      this.service.createTarefa(this.tarefaAtual).subscribe({
        next: () => {
          this.carregarTarefas();
          this.fecharModal();
        },
        error: (e) => alert(e.error || 'Erro ao criar. Verifique se o nome já existe.')
      });
    }
  }

  excluir(id: number | undefined) {
    if (!id) return;
    if (confirm("Tem certeza que deseja excluir?")) {
      this.service.deleteTarefa(id).subscribe(() => this.carregarTarefas());
    }
  }

  mover(id: number | undefined, direcao: 'cima' | 'baixo') {
    if (!id) return;
    this.service.reordenar(id, direcao).subscribe(() => this.carregarTarefas());
  }
}