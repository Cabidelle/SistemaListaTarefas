using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TarefasAPI.Data;
using TarefasAPI.Models;

namespace TarefasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarefasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TarefasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarefa>>> GetTarefas()
        {
            return await _context.Tarefas.OrderBy(t => t.OrdemApresentacao).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Tarefa>> PostTarefa(Tarefa tarefa)
        {
            if (await _context.Tarefas.AnyAsync(t => t.Nome == tarefa.Nome))
            {
                return BadRequest("Já existe uma tarefa com este nome.");
            }

            var maxOrdem = await _context.Tarefas.MaxAsync(t => (int?)t.OrdemApresentacao) ?? 0;
            tarefa.OrdemApresentacao = maxOrdem + 1;

            _context.Tarefas.Add(tarefa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTarefas", new { id = tarefa.Id }, tarefa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTarefa(int id, Tarefa tarefa)
        {
            if (id != tarefa.Id) return BadRequest();

            if (await _context.Tarefas.AnyAsync(t => t.Nome == tarefa.Nome && t.Id != id))
            {
                return BadRequest("Já existe outra tarefa com este nome.");
            }

            var tarefaExistente = await _context.Tarefas.FindAsync(id);
            if (tarefaExistente == null) return NotFound();

            tarefaExistente.Nome = tarefa.Nome;
            tarefaExistente.Custo = tarefa.Custo;
            tarefaExistente.DataLimite = tarefa.DataLimite;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarefa(int id)
        {
            var tarefa = await _context.Tarefas.FindAsync(id);
            if (tarefa == null) return NotFound();

            _context.Tarefas.Remove(tarefa);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/mover/{direcao}")]
        public async Task<IActionResult> Reordenar(int id, string direcao)
        {
            var tarefaAtual = await _context.Tarefas.FindAsync(id);
            if (tarefaAtual == null) return NotFound();

            Tarefa? tarefaTroca = null;

            if (direcao == "cima")
            {
                tarefaTroca = await _context.Tarefas
                    .Where(t => t.OrdemApresentacao < tarefaAtual.OrdemApresentacao)
                    .OrderByDescending(t => t.OrdemApresentacao)
                    .FirstOrDefaultAsync();
            }
            else
            {
                tarefaTroca = await _context.Tarefas
                    .Where(t => t.OrdemApresentacao > tarefaAtual.OrdemApresentacao)
                    .OrderBy(t => t.OrdemApresentacao)
                    .FirstOrDefaultAsync();
            }

            if (tarefaTroca != null)
            {
                int temp = tarefaAtual.OrdemApresentacao;
                tarefaAtual.OrdemApresentacao = tarefaTroca.OrdemApresentacao;
                tarefaTroca.OrdemApresentacao = temp;

                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}