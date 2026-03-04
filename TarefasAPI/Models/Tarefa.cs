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

        [Required(ErrorMessage = "O custo é obrigatório")]
        [Range(0, 999999999999, ErrorMessage = "O custo deve ser entre R$ 0 e R$ 999.999.999.999")]
        public decimal Custo { get; set; }

        [Required]
        public DateTime DataLimite { get; set; }

        public int OrdemApresentacao { get; set; }
    }
}