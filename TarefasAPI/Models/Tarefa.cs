using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TarefasAPI.Models
{
    public class Tarefa
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório")]
        public string Nome { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "O custo deve ser maior ou igual a zero")]
        public decimal Custo { get; set; }

        [Required]
        public DateTime DataLimite { get; set; }

        public int OrdemApresentacao { get; set; }
    }
}