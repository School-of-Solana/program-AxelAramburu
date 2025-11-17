# Project Description

**Deployed Frontend URL:** [TODO: Link to your deployed frontend]

**Solana Program ID:** [TODO: Your deployed program's public key]

## Project Overview

### Description
[TODO: Provide a comprehensive description of your dApp. Explain what it does. Be detailed about the core functionality.]
CrowdSol is a crowdfunding platform where users can initiate ideas/projects and ask for funds for it. It's participative fundings, all users can send Solana to contribute in the development of the project and the funds are locked in a `CSPVault`. Each participation is represented on chain by a `UserParticipation` account.

### Key Features
[TODO: List the main features of your dApp. Be specific about what users can do.]

- Feature 1: Create a crowdfunding
    - User can create a crowdfunding with the specifications described in the `CSPVault`. He can add a duration, a title, a description and a funds goal for the campaign.
- Feature 2: Participate/Donate in a crowdfunding 
    - User can send SOL to the crowdfunding project, he can add a comment with his donation. On chain the participation is represented by a `UserParticipation` account.
- Feature 3: Withdraw funds of a crowdfunding
    - The owner of the crowdfunding project can withdraw the funds when his campaign is ended.
  
### How to Use the dApp
[TODO: Provide step-by-step instructions for users to interact with your dApp]

1. **Connect Wallet**
2. **Main Action 1:** [Step-by-step instructions]
3. **Main Action 2:** [Step-by-step instructions]
4. ...

## Program Architecture
[TODO: Describe your Solana program's architecture. Explain the main instructions, account structures, and data flow.]

### PDA Usage
[TODO: Explain how you implemented Program Derived Addresses (PDAs) in your project. What seeds do you use and why?]

**PDAs Used:**
- PDA 1: [Purpose and description]
- PDA 2: [Purpose and description]

### Program Instructions
[TODO: List and describe all the instructions in your Solana program]

**Instructions Implemented:**
- Instruction 1: [Description of what it does]
- Instruction 2: [Description of what it does]
- ...

### Account Structure
[TODO: Describe your main account structures and their purposes]

```rust
// Example account structure (replace with your actual structs)
#[account]
pub struct CSPVault {
    pub owner: Pubkey,
    pub begin: u64
    pub duration: u64,
    pub title: String,
    pub description: String,
    pub funds_goal: u64,
}
#[account]
pub struct UserParticipation {
    pub user: Pubkey,
    pub csp_vault: Pubkey,
    pub amount: u64
    pub comment: u64,
}
```

## Testing

### Test Coverage
[TODO: Describe your testing approach and what scenarios you covered]

**Happy Path Tests:**
- Test 1: [Description]
- Test 2: [Description]
- ...

**Unhappy Path Tests:**
- Test 1: [Description of error scenario]
- Test 2: [Description of error scenario]
- ...

### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

[TODO: Add any specific notes or context that would help evaluators understand your project better]