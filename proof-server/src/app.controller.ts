import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BigNumber } from 'ethers';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/generate-commitment/:score')
  generateCommitment(@Param('score') score: string) {
    return this.appService.generateCommitment(BigNumber.from(score));
  }

  @Get('/commitments')
  getCommitments() {
    return { commitments: this.appService.getCommitments() };
  }

  @Post('/generate-proof')
  async generateProof(@Body() body) {
    return { proof: await this.appService.calculateProof(body.commitment) };
  }

  @Post('/store-commitment')
  storeCommitment(@Body() body) {
    return this.appService.storeCommitment(body.commitment);
  }
}
